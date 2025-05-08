import React, { useEffect, useState, Suspense } from 'react';
import { ArrowLeftCircle, ArrowRightCircle, ChevronRight, GraduationCap, Users, Award } from 'lucide-react';
import { useGetAcitivityStat } from '../../hooks/UseStat';
import AOS from 'aos';
import 'aos/dist/aos.css';

const slides = [
  {
    // Use lower resolution images or consider using WebP format
    url: "https://www.cpe.kmutt.ac.th/media/uploads/comcamp34/341837866_1645550245896808_2147681273716183221_n.jpg",
    title: "ComCamp 34",
    description: "Inspiring the next generation of computer engineers"
  },
  {
    url: "https://www.cpe.kmutt.ac.th/media/uploads/lastorientation33/350783392_953222625818656_7156209880393469282_n.jpg",
    title: "Orientation 33",
    description: "Welcome to our CPE family"
  },
  {
    url: "https://www.cpe.kmutt.ac.th/media/uploads/workshirt36/379226379_767482501850036_6804974411763229041_n.jpg",
    title: "Workshop 36",
    description: "Hands-on experience in cutting-edge technology"
  }
];

const Home = () => {
  useEffect(() => {
    const initAOS = () => {
      if (typeof AOS !== 'undefined' && AOS.init) {
        AOS.init({
          duration: 800, // Reduced from 1200
          once: true,
          easing: 'ease-out-cubic',
          // Disable animations on mobile for better performance
          disable: window.innerWidth < 768
        });
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initAOS();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(initAOS, 1000);
    }
  }, []);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { data: activityData, isLoading } = useGetAcitivityStat()

  // Preload critical images to improve LCP
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = [];
      
      // Only preload the first slide image and background for quick LCP
      const imagesToPreload = [
        slides[0].url,
        'https://web.cpe.kmutt.ac.th/media/seo/5fbf937e-587a-418a-a549-4bd1dc81b347.jpg'
      ];
      
      imagesToPreload.forEach(src => {
        const promise = new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
        imagePromises.push(promise);
      });
      
      Promise.all(imagePromises)
        .then(() => setImagesLoaded(true))
        .catch(err => {
          console.error('Failed to preload images:', err);
          setImagesLoaded(true); // Set to true anyway to show content
        });
    };
    
    preloadImages();
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isHovered]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const stats = [
    { 
      icon: GraduationCap, 
      label: "Active Users", 
      value: activityData?.user_count,
      color: "from-blue-500 to-cyan-400"
    },
    { 
      icon: Users, 
      label: "Alumni", 
      value: activityData?.alumni_count,
      color: "from-purple-500 to-pink-400"
    },
    { 
      icon: Award, 
      label: "Events", 
      value: activityData?.event_count,
      color: "from-amber-500 to-orange-400"
    }
  ];

  // Inline critical CSS for faster render
  // Use CSS background with lower resolution or placeholder during load
  const backgroundStyle = {
    backgroundImage: imagesLoaded 
      ? 'url("https://web.cpe.kmutt.ac.th/media/seo/5fbf937e-587a-418a-a549-4bd1dc81b347.jpg")'
      : 'linear-gradient(to bottom right, #1a202c, #2d3748)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Background with optimized loading */}
      <div 
        className="absolute inset-0"
        style={backgroundStyle}
      />
      
      {/* Overlay gradient - keep this */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text content - this should load quickly */}
            <div className="flex-1 text-white" data-aos="fade-right">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 group relative">
                <img 
                  src="/LogoCPE.png" 
                  alt="CPE Logo" 
                  className="w-8 h-8 rounded-full object-cover transition-all duration-500 ease-in-out group-hover:translate-x-[calc(750%+1rem)]" 
                />
                <span className="text-sm font-medium text-white/90">Welcome to Alumni CPE  KMUTT</span>
                <ChevronRight className="w-4 h-4 text-white/70" />
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
                <span className="block">
                  Alumni
                </span>
                <span className="block mt-2">
                  Computer Engineer
                </span>
              </h1>
              
              <p className="mt-8 text-lg text-white/80 leading-relaxed max-w-xl">
                Welcome to the CPE Alumni website, where we connect and support our alumni community.
              </p>

              {/* Stats with deferred animation */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500"
                    data-aos="fade-up"
                    data-aos-delay={100 + index * 50} // Reduced delay
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 blur-3xl rounded-full bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-all duration-500"
                         style={{
                           background: `linear-gradient(to bottom right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
                         }} />
                    
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 w-fit`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className={`text-3xl font-bold text-white mb-2`}>
                      {stat.value}
                    </div>
                    
                    <div className="text-lg text-white/90 font-medium">{stat.label}</div>
                    
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${stat.color} transform origin-left transition-all duration-500 group-hover:w-full mt-4`} />
                  </div>
                ))}
              </div>

              {/* ลบปุ่ม Explore Programs ตามคำขอ */}
            </div>

            {/* Optimized Carousel with lazy loading for non-active slides */}
            <div 
              className="w-full lg:w-1/2 relative"
              data-aos="fade-left"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-out transform
                      ${activeSlide === index ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-95'}`}
                  >
                    {/* Only load the current and next slide images */}
                    {(activeSlide === index || activeSlide === (index - 1 + slides.length) % slides.length) && (
                      <>
                        <img 
                          src={slide.url} 
                          className="w-full h-full object-cover transition-transform duration-10000 ease-out transform group-hover:scale-110"
                          alt={slide.title}
                          loading={index === 0 ? "eager" : "lazy"} // Eager load first slide only
                        />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform transition-all duration-300">
                          <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                          <p className="text-white/90">{slide.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <div className="absolute bottom-6 right-6 flex gap-3 z-30">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-black/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                  >
                    <ArrowLeftCircle className="w-5 h-5 text-white group-hover:text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-black/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                  >
                    <ArrowRightCircle className="w-5 h-5 text-white group-hover:text-white" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                  <div 
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`flex-1 h-1 rounded-full transition-all duration-300
                      ${activeSlide === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add normal style tag without jsx attribute */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Home;
