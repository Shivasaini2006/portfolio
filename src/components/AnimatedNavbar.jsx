import { useState, useEffect } from 'react';

const AnimatedNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidePosition, setSlidePosition] = useState(-20);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About me', href: '#about' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Contact me', href: '#contact' }
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
    const section = document.querySelector(navItems[index].href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = (index) => {
    setSlidePosition(index * 25);
  };

  const handleMouseLeave = () => {
    setSlidePosition(-25);
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
