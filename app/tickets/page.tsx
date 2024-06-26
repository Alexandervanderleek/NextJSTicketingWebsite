import React from 'react'
import prisma from '@/prisma/db';
import DataTable from './DataTable';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Pagination from '@/components/Pagination';
import StatusFilter from '@/components/StatusFilter';
import { Status, Ticket } from '@prisma/client';

export interface SearchParams {
  status: Status;
  page: string;
  orderBy: keyof Ticket
}

const Tickets = async ({searchParams}: {searchParams:SearchParams}) => {
  const pageSize = 10;
  const page = parseInt(searchParams.page) || 1

  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";

  const statuses = Object.values(Status);

  const status = statuses.includes(searchParams.status) ? searchParams.status: undefined;

  let where = {}

  if(status){
    where =  {
      status:status
    }
  }else{
    where = {
      NOT: [{status: "CLOSED" as Status}]
    }
  }

  const ticketCount = await prisma.ticket.count({where:where});

  const tickets = await prisma.ticket.findMany({
    where: where,
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page-1) * pageSize
  });


  

  return (
    <div>
      <div className='flex justify-between'>
      <StatusFilter></StatusFilter>
      <Link href={"/tickets/new"} className={buttonVariants({variant: "default"})}>New Ticket</Link>
      </div>
      <DataTable tickets={tickets} searchParams={searchParams}></DataTable>
      <Pagination itemCount={ticketCount} pageSize={pageSize} currentPage={page} />
    </div>
  )
}

export default Tickets