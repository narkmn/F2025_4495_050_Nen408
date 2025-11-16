<?php
/**
 * Plugin Name: Nutrition Chatbot
 * Description: OpenAI-powered chatbot for logged-in users. Saves chat history and uses recent messages as context.
 * Version: 0.1
 * Author: You
 */

if (!defined('ABSPATH')) exit;

register_activation_hook(__FILE__, 'nc_activate');
function nc_activate() {
    global $wpdb;
    $table = $wpdb->prefix . 'nutrition_chat_history';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS `$table` (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        session_id VARCHAR(255) DEFAULT '',
        role VARCHAR(16) DEFAULT 'user', -- 'user' or 'assistant' or 'system'
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY user_id (user_id),
        KEY session_id (session_id)
    ) $charset_collate;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

/* Enqueue scripts & localize */
add_action('wp_enqueue_scripts', 'nc_enqueue_scripts');
function nc_enqueue_scripts() {
    if (!is_user_logged_in()) return;

    wp_enqueue_script('nc-chat-js', plugin_dir_url(__FILE__) . 'js/chat.js', ['jquery'], '0.1', true);
    wp_localize_script('nc-chat-js', 'ncChatConfig', [
        'restUrl' => esc_url_raw(rest_url('nutrition-bot/v1/chat')),
        'nonce'   => wp_create_nonce('wp_rest'),
        'userId'  => get_current_user_id(),
    ]);
    wp_enqueue_style('nc-chat-css', plugin_dir_url(__FILE__) . 'css/chat.css');
}

/* Shortcode to show chatbot only for logged in users */
add_shortcode('nutrition_chatbot', 'nc_chatbot_shortcode');
function nc_chatbot_shortcode() {
    if ( ! is_user_logged_in() ) {
        return '<p>Please <a href="' . wp_login_url( get_permalink() ) . '">log in</a> to use the Nutrition Chatbot.</p>';
    }

    // The floating widget – no HTML is printed here, everything is injected by JS
    return '<div id="nc-floating-chat"></div>';
}

/* REST route - only logged in users */
add_action('rest_api_init', function() {
    register_rest_route('nutrition-bot/v1', '/chat', [
        'methods' => 'POST',
        'callback' => 'nc_handle_chat',
        'permission_callback' => function() {
            return is_user_logged_in();
        },
    ]);
    // GET: load history
    register_rest_route('nutrition-bot/v1', '/history', [
        'methods' => 'GET',
        'callback' => 'nc_get_chat_history',
        'permission_callback' => '__return_true',
    ]);
});

function nc_handle_chat(WP_REST_Request $request) {
    if (!is_user_logged_in()) {
        return new WP_REST_Response(['error' => 'Unauthorized'], 401);
    }

    global $wpdb;
    $user_id = get_current_user_id();
    $params  = $request->get_json_params();
    $message = isset($params['message']) ? sanitize_text_field($params['message']) : '';

    if (empty($message)) {
        return new WP_REST_Response(['error' => 'Empty message'], 400);
    }

    $table      = $wpdb->prefix . 'nutrition_chat_history';
    $session_id = isset($params['session_id']) ? sanitize_text_field($params['session_id']) : '';

    // === 1. Save user message ===
    $wpdb->insert($table, [
        'user_id'    => $user_id,
        'session_id' => $session_id,
        'role'       => 'user',
        'message'    => $message,
    ]);
    $user_insert_id = $wpdb->insert_id;
    $user_time = $wpdb->get_var($wpdb->prepare("SELECT created_at FROM $table WHERE id = %d", $user_insert_id));

    // === 2. Get LearnDash Lesson Context ===
    // $lesson_context = nc_get_learndash_context($user_id); //
    $lesson_context = "People need NMN";

    // === 2. Build context for OpenAI ===
    $limit = 10;
    $rows = $wpdb->get_results($wpdb->prepare(
        "SELECT role, message FROM $table WHERE user_id = %d ORDER BY id DESC LIMIT %d",
        $user_id, $limit
    ), ARRAY_A);
    $rows = array_reverse($rows);

    $messages = [[
        'role' => 'system',
        'content' => "You are a friendly nutrition coach. Be helpful, accurate, and concise."
                    . "Answer in 50 words or less. Be accurate, friendly, and concise. If you don't know, say you don't know."
                    . "Use this lesson context when relevant: \n\n{$lesson_context}"
    ]];

    foreach ($rows as $row) {
        $messages[] = [
            'role' => $row['role'] === 'assistant' ? 'assistant' : 'user',
            'content' => $row['message']
        ];
    }

    // === 3. Choose reply mode ===
    $use_test_reply = false; // SET TO true TO USE "i receive [text]"

    if ($use_test_reply) {
        $reply_text = "i receive {$message}";
    } else {
        $reply_text = nc_call_openai($messages);
        if ($reply_text === false) {
            $reply_text = "Sorry, I'm having trouble connecting to the AI right now.";
        }
    }

    // === 4. Save assistant reply ===
    $wpdb->insert($table, [
        'user_id'    => $user_id,
        'session_id' => $session_id,
        'role'       => 'assistant',
        'message'    => $reply_text,
    ]);
    $assistant_insert_id = $wpdb->insert_id;
    $assistant_time = $wpdb->get_var($wpdb->prepare("SELECT created_at FROM $table WHERE id = %d", $assistant_insert_id));

    // === 5. Format times ===
    $format = function($dt) { return $dt ? date('g:i A', strtotime($dt)) : ''; };

    return new WP_REST_Response([
        'reply' => $reply_text,
        'user_time' => $format($user_time),
        'assistant_time' => $format($assistant_time)
    ], 200);
}

function nc_get_chat_history(WP_REST_Request $request) {
    if (!is_user_logged_in()) return new WP_REST_Response(['error' => 'Unauthorized'], 401);

    global $wpdb;
    $user_id = get_current_user_id();
    $table   = $wpdb->prefix . 'nutrition_chat_history';

    $rows = $wpdb->get_results($wpdb->prepare(
        "SELECT role, message, created_at FROM $table WHERE user_id = %d ORDER BY created_at ASC",
        $user_id
    ), ARRAY_A);

    $format_time = function($dt) { return $dt ? date('g:i A', strtotime($dt)) : ''; };

    $history = array_map(function($row) use ($format_time) {
        return [
            'role' => $row['role'],
            'message' => $row['message'],
            'time' => $format_time($row['created_at'])
        ];
    }, $rows);

    return new WP_REST_Response(['history' => $history], 200);
}

/* OpenAI call - using PHP cURL and OPENAI_API_KEY defined in wp-config.php */
function nc_call_openai($messages) {
    if (!defined('OPENAI_API_KEY') || empty(OPENAI_API_KEY)) {
        error_log('OpenAI key not defined (OPENAI_API_KEY)');
        return false;
    }

    $payload = [
        'model' => 'gpt-4.1',
        'messages' => $messages,
        'max_tokens' => 600,
        'temperature' => 0.3,
    ];

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . OPENAI_API_KEY
        ],
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($curl_error) {
        error_log("OpenAI cURL Error: $curl_error");
        return false;
    }

    if ($http_code !== 200) {
        error_log("OpenAI HTTP $http_code: $response");
        return false;
    }

    $data = json_decode($response, true);
    return $data['choices'][0]['message']['content'] ?? false;
}
