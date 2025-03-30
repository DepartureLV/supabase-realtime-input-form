import { OnlineStatus } from "@/types/online_status";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck } from "lucide-react";

export default function OnlineBadge({ status }: { status: OnlineStatus }) {
    return (
      <AnimatePresence>
        <div className="w-fit h-8">
          {status === "inactive" && (
            <motion.div
              key="inactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2 items-center text-yellow-400"
            >
              <div className="relative h-6 w-6">
                <div className="absolute h-full w-full bg-yellow-400 rounded-full z-10" />
                <div className="absolute h-full w-full bg-yellow-400 rounded-full animate-ping" />
              </div>
              <span>{status}</span>
            </motion.div>
          )}
  
          {status === "submitted" && (
            <motion.div
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2 items-center"
            >
              <CircleCheck className="text-cyan-700" />
              <span>{status}</span>
            </motion.div>
          )}
  
          {status === "editing" && (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2 items-center text-green-700"
            >
              <div className="relative h-6 w-6">
                <div className="absolute h-full w-full bg-green-700 rounded-full z-10" />
                <div className="absolute h-full w-full bg-green-700 rounded-full animate-ping" />
              </div>
              <span>{status}</span>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    );
  }
  