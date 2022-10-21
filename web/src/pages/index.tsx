import { withUrqlClient } from "next-urql";
import React from "react";
import Navbar from "../components/navbar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

function Home() {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      <div className="text-gray-700">hello world</div>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        <div>
          {data.posts.map((p) => (
            <div key={p.id}>{p.title}</div>
          ))}
        </div>
      )}
    </>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
