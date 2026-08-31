import React from 'react';
import { CircularTestimonials } from './circular-testimonials';

const defaultTestimonials = [
  {
    quote:
      "Ayu delivered exceptional web design and front-end implementation for our campus portal. Very clean code and great attention to UI details!",
    name: "Dr. Bambang Sutrisno",
    designation: "Head of Informatics Dept - UNS",
    src:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    quote:
      "Her enthusiasm in mastering AI engineering and creative frontend interaction made her stand out during our collaborative projects.",
    name: "Rizky Pratama",
    designation: "Lead Project Collaborator",
    src:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    quote:
      "Nia is a fast learner with great passion for modern UI aesthetics and full-stack integration. Always a pleasure working together!",
    name: "Sarah Amanda",
    designation: "Product Designer & Mentor",
    src:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
  },
];

export const CircularTestimonialsDemo = ({ testimonials = defaultTestimonials }) => (
  <section className="w-full py-12 flex flex-col items-center justify-center">
    <div
      className="w-full max-w-5xl glow-card p-6 sm:p-10 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden"
    >
      <CircularTestimonials
        testimonials={testimonials}
        autoplay={true}
        colors={{
          name: "#ffffff",
          designation: "#38bdf8",
          testimony: "#cbd5e1",
          arrowBackground: "#1e293b",
          arrowForeground: "#ffffff",
          arrowHoverBackground: "#db2777",
        }}
        fontSizes={{
          name: "24px",
          designation: "15px",
          quote: "17px",
        }}
      />
    </div>
  </section>
);

export default CircularTestimonialsDemo;
