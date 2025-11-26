export default function FeaturedVideo() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">

        {/* Title */}
        <h2 className="text-4xl font-heading text-center mb-4">
          Featured Video!
        </h2>

        {/* Divider */}
        <div className="w-20 h-[2px] bg-gray-300 mx-auto mb-12"></div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT — Text */}
          <div>
            <h3 className="text-[29px] leading-snug font-body">
              Check out our channel for educational content, and join a
              community focused on the betterment of your health!
            </h3>
          </div>

          {/* RIGHT — YouTube Video */}
          <div className="w-full">
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/pUpcsd7ksg4?controls=1&rel=0&playsinline=1"
                title="Featured Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
