import { motion } from 'motion/react';
import EditorialSculpture from '../EditorialSculpture';
import type { Language } from '../components/SiteHeader';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.15, 1] as const },
};

export default function PublicationsPage({ theme, language }: { theme: 'light' | 'dark'; language: Language }) {
  const vi = language === 'vi';
  return (
    <main className="page detail-page publications-page">
      <section className="page-intro publication-intro" aria-labelledby="publications-title">
        <motion.div className="publication-intro-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 id="publications-title">{vi ? 'Công bố khoa học' : 'Published research'}</h1>
          <p className="page-intro-side">{vi ? 'Các công trình hội nghị về phân tích tài chính đa tác tử và dữ liệu giáo dục.' : 'Conference papers on multi-agent financial analysis and educational data.'}</p>
        </motion.div>
        <motion.div className="publication-intro-visual" {...reveal}>
          <EditorialSculpture kind="publication" theme={theme} language={language} />
        </motion.div>
      </section>

      <section className="paper-list" aria-label={vi ? 'Các công trình đã công bố' : 'Publications'}>
        <motion.article className="paper paper-featured" {...reveal}>
          <div className="paper-title-group">
            <p className="paper-title">A Multi-Agent System for Equity Analysis</p>
            <p className="paper-authors">Trong T. Nguyen, Quoc-Huy Le, Khanh G. Pham, Phuc M. Nguyen, Khuong N. Dang, Thi-Thiet Pham and Kien C. Nguyen.</p>
          </div>
          <div className="paper-meta">
            <p>{vi ? 'Hội nghị Quốc tế về Công nghệ Thông tin Thông minh (ICIIT), 2026' : 'International Conference on Intelligent Information Technology (ICIIT), 2026'}</p>
            <p>{vi ? 'Được lập chỉ mục trong Scopus' : 'Indexed in Scopus'}</p>
            <a href="https://dl.acm.org/doi/10.1145/3805862.3805922" target="_blank" rel="noreferrer">{vi ? 'Đọc bài báo trên ACM' : 'Read paper at ACM'} <span aria-hidden="true">↗</span></a>
          </div>
        </motion.article>

        <motion.article className="paper paper-secondary" {...reveal}>
          <div className="paper-title-group">
            <p className="paper-title">Applying Machine Learning Algorithms to Predict Students’ Academic Performance through Final Practical Exams</p>
            <p className="paper-authors">Le Quoc Huy, Nguyen Huu Quang, Nguyen Thanh Trong, Pham Gia Khanh, Nguyen Minh Phuc and Pham Thi Thiet.</p>
          </div>
          <div className="paper-meta">
            <p>{vi ? 'Kỷ yếu Hội nghị Nhà khoa học trẻ, tập 5' : 'Proceedings of the Young Scientists Conference, vol. 5'}</p>
            <p>{vi ? 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh, Việt Nam, 2024' : 'Industrial University of Ho Chi Minh City, Vietnam, 2024'}</p>
          </div>
        </motion.article>
      </section>

    </main>
  );
}
