import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Users, Activity, TrendingUp } from 'lucide-react';

function Number() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  const stats = [
    {
      number: '1,000+',
      label: 'ยอดใช้งาน',
      subtext: 'Active Users',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-400',
      bgGlow: 'from-blue-400/20 to-cyan-400/20',
      delay: 0,
    },
    {
      number: '15,000+',
      label: 'ศิษย์เก่าทั้งหมด',
      subtext: 'Alumni Network',
      icon: Users,
      color: 'from-violet-500 to-purple-400',
      bgGlow: 'from-violet-400/20 to-purple-400/20',
      delay: 100,
    },
    {
      number: '100+',
      label: 'กิจกรรมทั้งหมด',
      subtext: 'Events & Activities',
      icon: Activity,
      color: 'from-rose-500 to-orange-400',
      bgGlow: 'from-rose-400/20 to-orange-400/20',
      delay: 200,
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/50 py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={stat.delay}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${stat.bgGlow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-slate-100 p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} transform transition-transform duration-500 group-hover:scale-110`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-sm text-slate-500 font-medium">
                    {stat.subtext}
                  </div>
                </div>

                {/* Number with animated background */}
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgGlow} blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`relative font-title text-[clamp(2.5rem,5vw,3.5rem)] font-black tracking-tight leading-none bg-gradient-to-r ${stat.color} text-transparent bg-clip-text transform transition-transform duration-500 group-hover:scale-105`}>
                    {stat.number}
                  </div>
                </div>

                {/* Label */}
                <div className="mt-4 space-y-2">
                  <p className="text-slate-600 text-lg font-medium">
                    {stat.label}
                  </p>
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${stat.color} transform origin-left transition-all duration-500 group-hover:w-full`} />
                </div>

                {/* Interactive overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/40 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Number;