import { motion } from 'motion/react';
import EditorialSculpture from '../EditorialSculpture';
import type { Language } from '../components/SiteHeader';

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.68, ease: [0.2, 0.7, 0.15, 1] as const },
};

export default function ResearchPage({ theme, language }: { theme: 'light' | 'dark'; language: Language }) {
  const vi = language === 'vi';
  return (
    <main className="page detail-page research-page">
      <section className="page-intro research-intro" aria-labelledby="research-title">
        <motion.div className="research-intro-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 id="research-title">{vi ? 'Kinh nghiệm nghiên cứu' : 'Research experience'}</h1>
          <div className="research-role">
            <p>{vi ? 'Sinh viên nghiên cứu · Trường Đại học Công nghiệp Thành phố Hồ Chí Minh' : 'Student Researcher · Industrial University of Ho Chi Minh City'}</p>
            <span>{vi ? 'Tháng 10 năm 2023 – tháng 10 năm 2025' : 'October 2023 to October 2025'}</span>
          </div>
        </motion.div>
        <motion.div className="research-visual" {...reveal}>
          <EditorialSculpture kind="network" theme={theme} language={language} />
        </motion.div>
      </section>

      <section className="research-topics" aria-label={vi ? 'Các hướng nghiên cứu' : 'Research topics'}>
        <motion.article className="research-topic topic-learning" {...reveal}>
          <h2>{vi ? 'Phân tích dữ liệu học tập' : 'Learning analytics'}</h2>
          <div className="research-topic-copy">
            <p>{vi ? 'Phân tích hành vi học tập của sinh viên để dự đoán kết quả học tập và đưa ra phản hồi giúp cải thiện quá trình học.' : 'Analysed student learning behaviour to predict academic performance and deliver feedback that can guide improvement.'}</p>
            <span>{vi ? 'Dữ liệu giáo dục · Kết quả học tập' : 'Educational data · Student outcomes'}</span>
          </div>
        </motion.article>
        <motion.article className="research-topic topic-finance" {...reveal}>
          <h2>{vi ? 'Phân tích tài chính' : 'Financial intelligence'}</h2>
          <div className="research-topic-copy">
            <p>{vi ? 'Thiết kế nền tảng phân tích tài chính đa tác tử, đáp ứng các câu hỏi chuyên biệt theo từng lĩnh vực. Nền tảng kết hợp mô hình ngôn ngữ và phương pháp học máy để phân tích dữ liệu, giải thích kết quả.' : 'Designed a multi-agent financial analytics platform for sector-specific questions, combining language models and machine-learning methods to analyse data and explain model results.'}</p>
            <span>{vi ? 'Hệ đa tác tử · Mô hình ngôn ngữ lớn · Học máy' : 'Multi-agent systems · LLMs · Machine learning'}</span>
          </div>
        </motion.article>
      </section>

      <motion.section className="advisor-note" {...reveal} aria-label={vi ? 'Giảng viên hướng dẫn nghiên cứu' : 'Research advisors'}>
        <h2>{vi ? 'Giảng viên hướng dẫn' : 'Research advisors'}</h2>
        <p>
          <a href="https://www.researchgate.net/profile/Nguyen-Huynh-Tuong" target="_blank" rel="noreferrer">{vi ? 'PGS. Huỳnh Tường Nguyễn' : 'Assoc. Prof. Huynh Tuong Nguyen'}</a>,{' '}
          <a href="https://scholar.google.com/citations?user=8S9LHWEAAAAJ&amp;hl=en" target="_blank" rel="noreferrer">{vi ? 'TS. Kiên C. Nguyễn' : 'Dr. Kien C. Nguyen'}</a> {vi ? 'và' : 'and'}{' '}
          <a href="https://scholar.google.com.vn/citations?user=eQMSSY4AAAAJ&amp;hl=en" target="_blank" rel="noreferrer">{vi ? 'TS. Thi-Thiết Phạm' : 'Dr. Thi-Thiet Pham'}</a>.
        </p>
      </motion.section>

    </main>
  );
}
