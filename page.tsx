"use client";
import { DataTable } from "@/components/common/user-table";
import React, { Suspense, useEffect, useMemo, useState } from "react";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BranchForm } from "@/components/custom/settings/branchs/BranchForm";
import { User, UserWorker } from "@/app/types/types";
import { UserForm } from "@/components/custom/settings/branchs/UserForm";
import { addUser, getUsers } from "@/lib/actions/userActions";
import { toast } from "@/components/ui/use-toast";
import ConfirmDailog from "@/components/custom/settings/ConfirmDailog";
import ConfirmDailogUser from "@/components/custom/settings/ConfirmDialogUser";



const UserPage = () => {
  const [open, setOpen] = useState(false); // open dialog
  const [userObj, setUserObj] = useState<UserWorker>();
  const [addUser, setAddUser] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [isDeleteDailog, setIsDeleteDailog] = useState(false);
  const columnsUse = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "lastName",        
        header: ({ column }: any) => {
          return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Овог
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      
      {
        accessorKey: "firstName",        
        header: ({ column }: any) => {
          return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Нэр
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "email",
        header: "email",
      },
      {
        accessorKey: "phone",
        header: "Дугаар",
      },
      {
        accessorKey: "branch.code",
        header: "Салбарын ID",
      },
      {
        accessorKey: "branch.name",            
        header: ({ column }: any) => {
          return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Салбарын нэр
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "regNo",
        header: "Регистрийн дугаар",
      },
      
      {
        accessorKey: "statusId",
        header: "Статус",
        cell:({row}:any) =>{
          const data = row.getValue("statusId")
          return data === 1 ? "идэвхтэй" : "идэвхгүй"
        }
      },
      {
        accessorKey: "createdDate",
        header: "Үүссэн огноо",
        cell: ({ row }: any) => {
          const date = new Date(row.getValue("createdDate"));
          const dateFormatter = Intl.DateTimeFormat('sv-SE');
          const formatted = dateFormatter.format(date);//date.toString("yyyy-MM-dd");
          return <div className="font-medium">{formatted}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }: any) => {
          const userObj = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userObj.id)}>Copy user ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    className="w-full bg-font_blue_color_1 text-gray-50 hover:bg-blue-800 hover:text-gray-100"
                    variant="outline"
                    onClick={(e) => {
                     editDailog(userObj);
                     
                    }}
                  >
                    <AiOutlineEdit className="mx-2" />
                    <p>Засах</p>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={(e) => {
                      deleteDailogUser(userObj);
                    }}
                  >
                    <AiOutlineDelete className="mx-2" />
                    <p>Устгах</p>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );
  //let data: User[] =[];
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(async (result) => {
      // console.log((result))
      if(result.status){
        setData(await result.result[0]);
      }else{
        toast({
          variant: "destructive",
          className: "text-gray-300 text-2xl text-center",
          title: result.message || "Алдаа гарлаа.",
        });
      }
    });
  }, []);

  useEffect(() => {
    if(actionSuccess){      
      getUsers().then(async (result) => {
        console.log(result.status)
        if(result.status){
          setData(result.result[0]);
        }else{
          toast({
            variant: "destructive",
            className: "text-gray-300 text-2xl text-center",
            title: result.message || "Алдаа гарлаа.",
          });
        }
      });
      setActionSuccess(false);
    }
  }, [actionSuccess]);

  const editDailog = (usr: UserWorker) => {
  //  console.log("pppp first", org);
    setOpen(true);
    setUserObj(usr);
  };

  const deleteDailogUser = (usr: UserWorker) =>{
    setIsDeleteDailog(true)
    setUserObj(usr)
  }

  return (
    <section className="p-4 h-full">
      <h1 className="text-3xl font-bold mb-4 bg-gray-50 ml-0 pl-6 py-4 shadow-lg">Хэрэглэгчдийн жагсаалт</h1>
      <div className="px-4 bg-gray-50 shadow-lg">
        <Suspense fallback={"loading"}>
          {data?.length > 0 ? <DataTable columns={columnsUse} data={data} setAdd={setAddUser} /> : ""}
        </Suspense>
      </div>
      {open && <UserForm open={true} type="edit" setOpen={setOpen} user={userObj} setAction={setActionSuccess}/>}
      {addUser && <UserForm open={true} type="add" setOpen={setAddUser} setAction={setActionSuccess}/>}
      {isDeleteDailog && <ConfirmDailogUser open={true}  setOpen={setIsDeleteDailog}  user={userObj} setAction={setActionSuccess} />}
    </section>
  );
};

export default UserPage;
