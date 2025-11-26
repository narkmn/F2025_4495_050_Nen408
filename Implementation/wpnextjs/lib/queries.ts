const baseUrl=process.env.WORDPRESS_URL;
import { gql, GraphQLClient } from 'graphql-request';
// import { Page } from '@/lib/types';

const endpoint = 'https://healthacademy.ca/graphql';
const client = new GraphQLClient(baseUrl!);

const QUERY = `
  query GetPrimaryMenu {
    menuItems(where: { location: PRIMARY }) {
      nodes {
        id
        label
        url
        parentId
        order
      }
    }
  }
`;

export async function getPrimaryMenu() {
  const data = await client.request(QUERY);
  const items = data.menuItems.nodes;

  // Step 1: Make URLs work on localhost AND production
  const processedItems = items.map((item: any) => {
    let href = item.url;

    // Home is already "/"
    if (href === '/') {
      href = '/';
    }
    // Internal links → make them relative (works on localhost AND live site)
    else if (href.startsWith('https://healthacademy.ca')) {
      href = href.replace('https://healthacademy.ca', '');
    }
    // External links → leave them untouched

    return {
      id: item.id,
      label: item.label,
      href,              // new clean URL
      parentId: item.parentId,
      order: item.order,
      children: [],      // we'll fill this next
    };
  });
  
  // Step 2: Build a tree (handles sub-menus automatically)
  const map = new Map();
  processedItems.forEach((item: any) => map.set(item.id, item));

  const menuTree: any[] = [];

  processedItems.forEach((item: any) => {
    if (item.parentId === null) {
      menuTree.push(item);
    } else {
      const parent = map.get(item.parentId);
      if (parent) parent.children.push(item);
    }
  });

  // Step 3: Sort everything by order
  const sortByOrder = (a: any, b: any) => a.order - b.order;
  menuTree.sort(sortByOrder);
  menuTree.forEach((item: any) => item.children.sort(sortByOrder));

  return menuTree;
}


  // export async function getPageBySlug(slug: string): Promise<Page> {
//   const query = gql`
//     query GetPageBySlug($slug: ID!) {
//       page(id: $slug, idType: SLUG) {
//         id
//         title
//         content
//       }
//     }
//   `;
// }

//homepade-final-edu-2
// query GetDashboardPage {
//   page(id: "dashboard", idType: URI) {
//     id
//     databaseId
//     title
//     content(format: RENDERED)
//     slug
//     uri
//     status
//     date
//     modified
//     link
//     featuredImage {
//       node {
//         sourceUrl
//         altText
//         mediaDetails {
//           width
//           height
//         }
//       }
//     }
//     seo {
//       title
//       metaDesc
//       opengraphImage {
//         sourceUrl
//       }
//     }
//   }
// }


// query GetHomepage {
//   page(id: 6267, idType: DATABASE_ID) {
//     id
//     databaseId
//     title
//     slug
//     uri
//     status
//     date
//     modified

//     content(format: RENDERED)

//     featuredImage {
//       node {
//         sourceUrl
//         altText
//         mediaDetails {
//           width
//           height
//         }
//       }
//     }
//   }
// }


// query AllPage {
//   pages {
//     nodes {
//       uri
//       title(format: RAW)
//       template {
//         templateName
//       }
//       slug
//       status
//     }
//   }
// }