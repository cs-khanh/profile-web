import { motion } from 'motion/react';
import EditorialSculpture from '../EditorialSculpture';
import type { Language } from '../components/SiteHeader';

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.68, ease: [0.2, 0.7, 0.15, 1] as const },
};

export default function ProfilePage({ theme, language }: { theme: 'light' | 'dark'; language: Language }) {
  const vi = language === 'vi';
  return (
    <main className="page detail-page profile-page">
      <section className="page-intro profile-intro-page" aria-labelledby="profile-title">
        <motion.div className="profile-intro-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="profile-intro-copy">
            <h1 id="profile-title">{vi ? 'Hồ sơ chuyên môn' : 'Professional profile'}</h1>
            <p className="page-intro-side">{vi ? 'Kinh nghiệm, học vấn, thành tích và kỹ năng chuyên môn.' : 'Experience, education, recognition and technical skills.'}</p>
          </div>
          <div className="profile-intro-visual">
            <EditorialSculpture kind="profile" theme={theme} language={language} />
          </div>
        </motion.div>
      </section>

      <section className="profile-page-section experience-page-section" aria-labelledby="experience-title">
        <motion.h2 {...reveal} id="experience-title">{vi ? 'Kinh nghiệm' : 'Experience'}</motion.h2>
        <motion.article className="experience-entry" {...reveal}>
          <div><h3>{vi ? 'Kỹ sư dữ liệu' : 'Data Engineer'} · <a className="experience-company" href="https://ncc.plus/" target="_blank" rel="noreferrer">NCCPLUS <span aria-hidden="true">↗</span></a></h3><span>{vi ? 'Tháng 8 năm 2025 – nay' : 'August 2025 to present'}</span></div>
          <div className="experience-details">
            <p>{vi ? 'Vận hành và duy trì các quy trình ETL cho dữ liệu fintech, từ thu thập, xử lý, chuyển đổi đến phân phối dữ liệu. Theo dõi quy trình, khắc phục lỗi xử lý và kiểm tra các vấn đề về chất lượng dữ liệu.' : 'Operate and maintain fintech ETL pipelines for collecting, processing, transforming and delivering data. Monitor workflows, troubleshoot processing errors and investigate data-quality issues.'}</p>
            <p>{vi ? 'Hỗ trợ vận hành dữ liệu trên AWS S3, Lambda, Glue, EC2 và Athena; sử dụng Terraform, MySQL, Postman cho hạ tầng và kiểm thử; duy trì quy trình CI/CD bằng GitHub Actions.' : 'Support cloud data operations with AWS S3, Lambda, Glue, EC2 and Athena; use Terraform, MySQL and Postman for infrastructure and testing; maintain CI/CD workflows with GitHub Actions.'}</p>
          </div>
        </motion.article>
      </section>

      <section className="profile-page-section education-page-section" aria-labelledby="education-title">
        <motion.h2 {...reveal} id="education-title">{vi ? 'Học vấn' : 'Education'}</motion.h2>
        <motion.article className="education-entry" {...reveal}>
          <div><h3>{vi ? 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh' : 'Industrial University of Ho Chi Minh City'}</h3><p>{vi ? 'Cử nhân Khoa học máy tính · Tháng 9, 2022 đến tháng 10, 2026' : 'BSc Computer Science · September 2022 to October 2026'}</p></div>
          <div className="education-proof">
            <strong>3.78 / 4.0</strong>
            <span>{vi ? 'Xếp hạng top 0,1% của Khoa CNTT · hơn 4.000 sinh viên' : 'Top 0.1% in the Faculty of IT · 4,000+ students'}</span>
            <span>{vi ? 'Điểm khóa luận: 4,0 / 4,0' : 'Thesis score: 4.0 / 4.0'}</span>
          </div>
        </motion.article>
        <motion.div className="thesis-line" {...reveal}>
          <p>{vi ? 'Khóa luận' : 'Thesis'}</p>
          <h3>{vi ? 'Phát triển mô hình học sâu bán giám sát để phát hiện lỗi mũi khoan từ ảnh đa góc nhìn' : 'Develop a Semi-Supervised Deep Learning Model for Detecting Drill Bit Defects from Multi-View Images'}</h3>
          <span>{vi ? 'Giảng viên hướng dẫn: ' : 'Advisor: '}<a href="https://scholar.google.com/citations?user=pNQ8puIAAAAJ&amp;hl=vi&amp;oi=ao" target="_blank" rel="noreferrer">{vi ? 'TS. Đặng Thị Phúc' : 'Dr. Dang Thi Phuc'}</a></span>
        </motion.div>
      </section>

      <section className="profile-page-section recognition-section" aria-labelledby="recognition-title">
        <motion.h2 {...reveal} id="recognition-title">{vi ? 'Thành tích' : 'Recognition'}</motion.h2>
        <motion.div className="recognition-content" {...reveal}>
          <p><strong>{vi ? '7 lần nhận học bổng khuyến khích học tập' : 'Seven merit-based scholarships'}</strong>{vi ? ', nhờ duy trì thành tích trong top 5% qua các học kỳ liên tiếp.' : ' awarded for consecutive terms in the top 5%.'}</p>
          <p><strong>{vi ? 'Giải Sản phẩm được yêu thích nhất' : 'Most Popular Product Award'}</strong>{vi ? ', Cuộc thi học thuật, Trường Đại học Công nghệ Thông tin, Thành phố Hồ Chí Minh (2024).' : ', Academic Competition, University of Information Technology, Ho Chi Minh City (2024).'}</p>
        </motion.div>
      </section>

      <section className="profile-page-section skills-page-section" aria-labelledby="skills-title">
        <motion.h2 {...reveal} id="skills-title">{vi ? 'Kỹ năng chuyên môn' : 'Technical skills'}</motion.h2>
        <motion.div className="skills-rows" {...reveal}>
          <p><strong>{vi ? 'Ngôn ngữ lập trình' : 'Programming'}</strong><span>Python, SQL, C/C++, Java</span></p>
          <p><strong>{vi ? 'AI & học máy' : 'AI & machine learning'}</strong><span>PyTorch, TensorFlow, scikit-learn, AutoGen, LangGraph, RAG</span></p>
          <p><strong>{vi ? 'Điện toán đám mây' : 'Cloud'}</strong><span>AWS S3, Glue, Athena, Lambda, EC2, Step Functions, CloudWatch, CloudTrail, IAM</span></p>
          <p><strong>{vi ? 'Dữ liệu & cơ sở dữ liệu' : 'Data & databases'}</strong><span>MySQL, PostgreSQL, SQL Server, ClickHouse, Airflow, Dagster, Pandas, NumPy, PySpark, Polars</span></p>
          <p><strong>{vi ? 'Kỹ thuật & trực quan hóa' : 'Engineering & visualisation'}</strong><span>Terraform, Docker, Git, GitHub, Seaborn, Matplotlib</span></p>
        </motion.div>
      </section>
    </main>
  );
}
