import { motion } from 'motion/react';
import HeroSculpture from '../HeroSculpture';
import type { Language } from '../components/SiteHeader';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.15, 1] as const },
};

function RepoLink({ href, language }: { href: string; language: Language }) {
  return <a className="project-link" href={href} target="_blank" rel="noreferrer">{language === 'vi' ? 'Xem dự án trên GitHub' : 'View project on GitHub'} <span aria-hidden="true">↗</span></a>;
}

export default function ProjectsPage({ theme, language }: { theme: 'light' | 'dark'; language: Language }) {
  const vi = language === 'vi';
  return (
    <main className="page detail-page projects-page">
      <section className="page-intro projects-intro" aria-labelledby="projects-title">
        <motion.h1 id="projects-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>{vi ? 'Dự án tiêu biểu' : 'Selected projects'}</motion.h1>
        <motion.p className="page-intro-side" {...reveal}>{vi ? 'Ứng dụng học máy, thị giác máy tính và xử lý tài liệu thông minh.' : 'Applied machine learning, computer vision and document understanding.'}</motion.p>
      </section>

      <motion.article className="project-feature" {...reveal} aria-labelledby="drill-title">
        <div className="project-feature-copy">
          <h2 id="drill-title">{vi ? <>Tám góc nhìn.<br />Một mũi khoan.</> : <>Eight views.<br />One drill bit.</>}</h2>
          <p className="project-lead">{vi ? 'Phát hiện lỗi mũi khoan đa góc nhìn bằng phương pháp học bán giám sát.' : 'Semi-supervised multi-view drill-bit defect detection.'}</p>
          <p>{vi ? 'Xây dựng bộ dữ liệu công nghiệp riêng trong điều kiện chiếu sáng được kiểm soát, gồm các lỗi gãy, mẻ, mòn đầu, gỉ nghiêm trọng và trầy xước. YOLOv8-seg phân đoạn vùng quan tâm trước bước phát hiện.' : 'Built a custom industrial dataset under controlled lighting for Broken, Chipped, Tip Wear, Severe Rust and Scratched defects. YOLOv8-seg extracts the region of interest before detection.'}</p>
          <p>{vi ? 'So sánh Faster R-CNN, Unbiased Teacher, SoftTeacher và MixPL, sau đó phát triển mô hình Multi-View SoftTeacher với bộ phát hiện ResNet-50/FPN dùng chung và nhãn giả có tính đến độ bất định trên tám góc nhìn đồng bộ.' : 'Compared Faster R-CNN, Unbiased Teacher, SoftTeacher and MixPL, then developed a Multi-View SoftTeacher model with a shared ResNet-50/FPN detector and uncertainty-aware pseudo-labels across eight synchronized views.'}</p>
          <p className="project-result">{vi ? 'MixPL đạt AP50 76,0 với 40% dữ liệu có nhãn. Với 10% dữ liệu có nhãn, mô hình đạt AP50 68,7.' : 'MixPL reached AP50 76.0 with 40% labelled data. With 10% labels, the model reached AP50 68.7.'}</p>
          <p className="project-tools">PyTorch · YOLOv8-seg · Faster R-CNN · SoftTeacher · MVViT</p>
          <RepoLink href="https://github.com/cs-khanh/kltn-final-semi-supervised" language={language} />
        </div>
        <HeroSculpture theme={theme} language={language} />
      </motion.article>

      <motion.article className="project-study project-study-face" {...reveal}>
        <div className="project-study-heading"><h2>{vi ? <>Nhận diện khuôn mặt<br />chống giả mạo.</> : <>Face recognition<br />with anti-spoofing.</>}</h2><span>{vi ? 'Nhóm 2 thành viên' : 'Team of 2'}</span></div>
        <div className="project-study-copy">
          <p>{vi ? 'Xây dựng quy trình xác minh danh tính thời gian thực, dùng SCRFD để phát hiện khuôn mặt và ArcFace để nhận diện. Cơ chế xác thực người thật giúp phát hiện các hình thức giả mạo bằng ảnh in, video phát lại hoặc mặt nạ.' : 'A real-time identity-verification pipeline using SCRFD for detection and ArcFace for recognition. Liveness checks cover printed photos, replay videos and masks.'}</p>
          <p>{vi ? 'FAISS tìm kiếm các vector đặc trưng để truy xuất danh tính. Độ trễ suy luận đạt 50–60 ms trên GPU và 113–140 ms trên CPU.' : 'Embedding search with FAISS supports identity retrieval. Inference latency is 50 to 60 ms on GPU and 113 to 140 ms on CPU.'}</p>
          <p className="project-tools">OpenCV · InsightFace · ONNX Runtime · FAISS</p>
          <RepoLink href="https://github.com/cs-khanh/checkin_face_anti_spoofing" language={language} />
        </div>
      </motion.article>

      <motion.article className="project-study project-study-vqa" {...reveal}>
        <div className="project-study-heading"><h2>{vi ? <>Hỏi đáp trên tài liệu<br />tiếng Việt.</> : <>Vietnamese<br />visual QA.</>}</h2><span>{vi ? 'Nhóm 2 thành viên' : 'Team of 2'}</span></div>
        <div className="project-study-copy">
          <p>{vi ? 'Xây dựng hệ thống hỏi đáp trên tài liệu cho bộ dữ liệu Viet-Doc-VQA gồm 51.856 ảnh và 310.952 cặp câu hỏi – câu trả lời. Hệ thống kết hợp đặc trưng hình ảnh từ InternViT với khả năng xử lý ngôn ngữ tiếng Việt.' : 'Built a text-visual QA system for Viet-Doc-VQA: 51,856 document images and 310,952 question and answer pairs. The pipeline combines visual features from InternViT with Vietnamese language understanding.'}</p>
          <p>{vi ? 'Mô hình VinTern-1B-v2 sau tinh chỉnh đạt BLEU 0,0689, ROUGE-1 0,6558, ROUGE-2 0,4745 và ROUGE-L 0,5349.' : 'Fine-tuned VinTern-1B-v2 reached BLEU 0.0689, ROUGE-1 0.6558, ROUGE-2 0.4745 and ROUGE-L 0.5349.'}</p>
          <p className="project-tools">InternViT · PhoBERT · Qwen2 · VinTern-1B-v2</p>
          <a className="project-link" href="https://github.com/cs-khanh/NLP_Visual_Question_Answering" target="_blank" rel="noreferrer">{vi ? 'Xem dự án trên GitHub' : 'View project on GitHub'} <span aria-hidden="true">↗</span></a>
          <a className="project-link secondary-project-link" href="https://huggingface.co/datasets/5CD-AI/Viet-Doc-VQA-flash2" target="_blank" rel="noreferrer">{vi ? 'Khám phá bộ dữ liệu' : 'Explore the dataset'} <span aria-hidden="true">↗</span></a>
        </div>
      </motion.article>
    </main>
  );
}
