import { MotionConfig, motion } from "motion/react";

export function Application() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="accueil">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Savanturier
        </motion.h1>
        <p>Réviser le programme du CP au CM2, en jouant.</p>
      </main>
    </MotionConfig>
  );
}
