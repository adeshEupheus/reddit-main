import React from "react";
import NextLink from "next/link";
import {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";
import { isServer } from "../utils/isServer";

const Navbar: React.FC = () => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [, logout] = useLogoutMutation();

  // console.log("data : " + data);

  let body = null;

  if (!data?.me) {
    body = (
      <>
        <NextLink href={"/login"}>
          <span className="text-gray-100 cursor-pointer">Login</span>
        </NextLink>
        <NextLink href={"/register"}>
          <span className="text-gray-100 cursor-pointer">Register</span>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <span className="text-gray-100">{data.me.userName}</span>
        <span className="text-gray-100 cursor-pointer" onClick={() => logout()}>
          Logout
        </span>
      </>
    );
  }

  return (
    <div className="w-[100vw] p-4 bg-teal-600 flex gap-2 justify-end">
      {body}
    </div>
  );
};

export default Navbar;
