import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  authors: {
    title: 'Authors',
    links: [
      { text: 'Fee for Publication', to: '/mansucript_handling_fee' },
      { text: 'FAQ for Authors', to: '/faq/authorfaq' },
      { text: 'Policy on Waivers', to: '/waiver_policy' },
      { text: 'Peer Review Process', to: '/peer_review' }
    ]
  },
  editors: {
    title: 'Editors & Reviewers',
    links: [
      { text: 'FAQ for Reviewers', to: '/faq/reviewfaq' },
      { text: 'FAQ for Editors', to: '/faq/editorfaq' },
      { text: 'Reviewers Guidelines', to: '/reviewers_guidelines' },
      { text: 'Editors', to: '/for_editors' },
      { text: 'Editorial Board', to: '/editorial-board' }
    ]
  },
  general: {
    title: 'General',
    links: [
      { text: 'Policies', to: '/policies' },
      { text: 'Contact Us', to: '/contact/new' },
      { text: 'Subscribe to RSS', to: '/all_articles.rss' },
      { text: 'Terms of Use', to: '/terms' }
    ]
  }
};

const Footer = () => {
  const FooterSection = ({ title, links }) => (
    <div className="flex flex-col space-y-4 sm:space-y-5">
      <h3 className="font-bold text-lg sm:text-xl md:text-2xl mb-2">{title}</h3>
      <div className="flex flex-col space-y-2 sm:space-y-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm sm:text-base hover:text-yellow-300 transition-colors duration-200 py-1"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer className="bg-[#543a31] text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {Object.entries(footerLinks).map(([key, section]) => (
            <FooterSection
              key={key}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20 text-center text-sm sm:text-base text-white/80">
          <p>&copy; {new Date().getFullYear()} Scientific Journals Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;