import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { CarePlan, Resident, Staff, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type CarePlanList = CarePlan & {
  resident: Resident;
  staff: Staff;
};

const CarePlanListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Resident",
      accessor: "resident",
    },
    {
      header: "Staff",
      accessor: "staff",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Date",
      accessor: "startDate",
      className: "hidden md:table-cell",
    },
    {
      header: "End Date",
      accessor: "endDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "nurse"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: CarePlanList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.resident.fullName}</td>
      <td className="hidden md:table-cell">
        {item.staff ? `${item.staff.name} ${item.staff.surname}` : "Unassigned"}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startDate)}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.endDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "nurse") && (
            <>
              <FormModal table="carePlan" type="update" data={item} />
              <FormModal table="carePlan" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.CarePlanWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "residentId":
            query.residentId = value;
            break;
          case "staffId":
            query.staffId = value;
            break;
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              {
                resident: {
                  fullName: { contains: value, mode: "insensitive" },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "nurse":
      query.staffId = currentUserId!;
      break;
    case "family":
      query.resident = {
        familyId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.carePlan.findMany({
      where: query,
      include: {
        resident: { select: { fullName: true } },
        staff: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.carePlan.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Care Plans
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" ||
              (role === "nurse" && (
                <FormModal table="carePlan" type="create" />
              ))}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default CarePlanListPage;
