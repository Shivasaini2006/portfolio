import { useState, useEffect } from 'react';

const AnimatedNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidePosition, setSlidePosition] = useState(-20);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About me', href: '#about' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Contact me', href: '#contact' },
    { label: 'Resume', href: '/ShivaResume.pdf', download: true }
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
    // Handle download link
    if (navItems[index].download) {
      const link = document.createElement('a');
      link.href = navItems[index].href;
      link.download = 'Shiva_Resume.pdf';
      link.click();
      return;
    }
    // Handle regular navigation
    const section = document.querySelector(navItems[index].href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = (index) => {
    setSlidePosition(index * 20);
  };

  const handleMouseLeave = () => {
    setSlidePosition(-20);
  };

  useEffect(() => {
    // Observe sections to update active state on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = navItems.findIndex(item => item.href === `#${entry.target.id}`);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach(item => {
      // Skip the download link, only observe section anchors
      if (item.download) return;
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="animated-nav">
      <ul className="animated-nav-list">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`animated-nav-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            style={{ animationDelay: `${0.15 + index * 0.15}s` }}
          >
            {item.label}
          </li>
        ))}
        <li 
          className="slide" 
          style={{ left: `${slidePosition}vw` }}
        />
      </ul>
    </nav>
  );
};

export default AnimatedNavbar;
