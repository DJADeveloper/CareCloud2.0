import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";

import { auth } from "@clerk/nextjs/server";

type AssessmentList = {
  id: number;
  title: string;
  residentName: string;
  residentSurname: string;
  careProviderName: string;
  careProviderSurname: string;
  score: number;
  roomName: string;
  date: Date;
};

const ResidentAssessmentListPage = async ({
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
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Care Provider",
      accessor: "careProvider",
      className: "hidden md:table-cell",
    },
    {
      header: "Room",
      accessor: "room",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "careProvider"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: AssessmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.residentName + " " + item.residentSurname}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">
        {item.careProviderName + " " + item.careProviderSurname}
      </td>
      <td className="hidden md:table-cell">{item.roomName}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "careProvider") && (
            <>
              <FormContainer table="assessment" type="update" data={item} />
              <FormContainer table="assessment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AssessmentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "residentId":
            query.residentId = value;
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
    case "careProvider":
      query.careProviderId = currentUserId!;
      break;

    case "resident":
      query.residentId = currentUserId!;
      break;

    case "family":
      query.resident = {
        familyId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.assessment.findMany({
      where: query,
      include: {
        resident: { select: { fullName: true } },
        careProvider: { select: { name: true, surname: true } },
        room: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assessment.count({ where: query }),
  ]);

  const data = dataRes.map((item) => ({
    id: item.id,
    title: item.title,
    residentName: item.resident.fullName.split(" ")[0],
    residentSurname: item.resident.fullName.split(" ")[1] || "",
    careProviderName: item.careProvider.name,
    careProviderSurname: item.careProvider.surname,
    score: item.score,
    roomName: item.room.name,
    date: item.date,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assessments
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
            {(role === "admin" || role === "careProvider") && (
              <FormContainer table="assessment" type="create" />
            )}
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

export default ResidentAssessmentListPage;
