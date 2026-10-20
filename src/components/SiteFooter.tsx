import { motion } from 'motion/react';
import type { Language } from './SiteHeader';

export default function SiteFooter({ language }: { language: Language }) {
  const copy = language === 'vi'
    ? { headline: <>Cùng xây dựng<br />những hệ thống tin cậy.</>, invitation: 'Quan tâm đến các cơ hội trong lĩnh vực nghiên cứu, kỹ thuật dữ liệu và học máy.', location: 'Khoa học máy tính · Thành phố Hồ Chí Minh, Việt Nam', home: 'Khanh Pham Gia, trang chủ' }
    : { headline: <>Let’s build<br />something reliable.</>, invitation: 'Open to research, data engineering and machine-learning opportunities.', location: 'Computer Science · Ho Chi Minh City, Vietnam', home: 'Khanh Pham Gia, home' };
  return (
    <footer className="global-footer">
      <div className="footer-main">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65 }}>
          <h2>{copy.headline}</h2>
          <p>{copy.invitation}</p>
        </motion.div>
        <a className="footer-contact" href="mailto:khanh.phamgiaa@gmail.com">khanh.phamgiaa@gmail.com <span aria-hidden="true">↗</span></a>
      </div>
      <div className="footer-base">
        <a className="footer-signature-lockup" href="/" aria-label={copy.home}>
          <img src="/profile.png" alt="" />
          <span className="footer-signature">Khanh Pham Gia<span>.</span></span>
        </a>
        <p>{copy.location}</p>
        <div className="footer-links">
          <a href="https://github.com/cs-khanh" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/csephamgiakhanh/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>
    </footer>
  );
}
