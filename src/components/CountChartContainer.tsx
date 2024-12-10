import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.resident.groupBy({
    by: ["careLevel"],
    _count: true,
  });

  const low = data.find((d) => d.careLevel === "LOW")?._count || 0;
  const medium = data.find((d) => d.careLevel === "MEDIUM")?._count || 0;
  const high = data.find((d) => d.careLevel === "HIGH")?._count || 0;

  const total = low + medium + high;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Residents by Care Level</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <CountChart low={low} medium={medium} high={high} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16 mt-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{low}</h1>
          <h2 className="text-xs text-gray-300">
            Low ({total > 0 ? Math.round((low / total) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{medium}</h1>
          <h2 className="text-xs text-gray-300">
            Medium ({total > 0 ? Math.round((medium / total) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-red-400 rounded-full" />
          <h1 className="font-bold">{high}</h1>
          <h2 className="text-xs text-gray-300">
            High ({total > 0 ? Math.round((high / total) * 100) : 0}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
