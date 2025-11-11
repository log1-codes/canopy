"use client"
import { motion } from "framer-motion"
interface NoWorkSpaceProps {
  query: string
}

export function NoWorkSpace({ query }: NoWorkSpaceProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"as const ,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 4,
        ease: "easeInOut" as const ,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.3, 0.5],
      transition: {
        duration: 3,
        ease: "easeInOut" as const,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Decorative animated circles */}
      <motion.div className="relative w-40 h-40 mb-8 flex items-center justify-center" variants={itemVariants}>
        {/* Background pulsing circle */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute inset-0 rounded-full bg-indigo-600/10 border border-indigo-600/20"
        />

        {/* Floating icon container */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/20 to-indigo-600/5 border border-indigo-600/40"
        >
          <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Text content */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-neutral-200">No workspaces found</h3>
        <p className="text-neutral-400 text-sm max-w-xs">
          {query ? (
            <>
              We couldn't find any workspaces matching <span className="text-indigo-400 font-medium">"{query}"</span>
            </>
          ) : (
            "Create a new workspace to get started"
          )}
        </p>
      </motion.div>

      {/* Animated dots */}
      <motion.div variants={itemVariants} className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              backgroundColor: ["rgba(79, 70, 229, 0.4)", "rgba(79, 70, 229, 0.8)", "rgba(79, 70, 229, 0.4)"],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
