import { motion } from 'motion/react';
import HomeDataCore from '../HomeDataCore';
import type { Language } from '../components/SiteHeader';

export default function HomePage({ theme, language }: { theme: 'light' | 'dark'; language: Language }) {
  const vi = language === 'vi';
  return (
    <main className="page home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <motion.div className="home-copy" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <p className="hero-role">{vi ? 'Khoa học máy tính · Kỹ thuật dữ liệu' : 'Computer Science · Data Engineering'}</p>
          <h1 id="home-title">Khanh Pham Gia</h1>
          <p className="home-intro">{vi ? 'Tôi xây dựng các hệ thống dữ liệu tin cậy và nghiên cứu cách học máy giải quyết những vấn đề thực tiễn.' : 'I build reliable data systems and research how machine learning can solve practical problems.'}</p>
          <a className="button" href="/research/">{vi ? 'Khám phá nghiên cứu' : 'Explore my research'} <span aria-hidden="true">↗</span></a>
        </motion.div>
        <motion.div className="home-specimen" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }}>
          <HomeDataCore theme={theme} language={language} />
        </motion.div>
      </section>
      <section className="home-index" aria-labelledby="home-index-title">
        <div className="home-index-heading">
          <p>{vi ? 'Khám phá hồ sơ năng lực' : 'Explore the portfolio'}</p>
          <h2 id="home-index-title">{vi ? 'Tổng quan về các công trình của tôi.' : 'A clear path through my work.'}</h2>
        </div>
        <nav className="home-index-list" aria-label="Portfolio sections">
          <a href="/research/" className="home-index-link">
            <h3>{vi ? 'Kinh nghiệm nghiên cứu' : 'Research experience'}</h3>
            <p>{vi ? 'Hai hướng nghiên cứu, những câu hỏi tôi theo đuổi và các giảng viên hướng dẫn.' : 'Two research directions, the questions behind them and the advisors I worked with.'}</p>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="/publications/" className="home-index-link">
            <h3>{vi ? 'Công bố khoa học' : 'Publications'}</h3>
            <p>{vi ? 'Bài báo ACM đã xuất bản và một công trình hội nghị trước đó.' : 'The published ACM paper and an earlier conference proceeding.'}</p>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="/projects/" className="home-index-link">
            <h3>{vi ? 'Dự án tiêu biểu' : 'Selected projects'}</h3>
            <p>{vi ? 'Các hệ thống học máy ứng dụng, kết quả đánh giá và mã nguồn.' : 'Applied machine learning systems, evaluation results and source code.'}</p>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="/profile/" className="home-index-link">
            <h3>{vi ? 'Hồ sơ chuyên môn' : 'Professional profile'}</h3>
            <p>{vi ? 'Kinh nghiệm kỹ thuật dữ liệu, học vấn, thành tích và kỹ năng chuyên môn.' : 'Data engineering experience, education, recognition and technical skills.'}</p>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </section>
    </main>
  );
}
