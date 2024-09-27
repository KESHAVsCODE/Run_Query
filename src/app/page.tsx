"use client";
import { useEffect, useState } from "react";
import { queries } from "./constants";
import ResultTable from "./ResultTable";
import styles from "./page.module.scss";

export default function Home() {
  const [columnsDataList, setColumnsDataList] = useState<string[]>([]);
  const [rowsDataList, setRowsDataList] = useState<Array<Object>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [queryDetails] = useState<{ queryName: string; query: string }>(queries[2]); // change the address according to you query type mention in constant file

  const fetchGraphQLData = async () => {
    const url = "https://api.studio.thegraph.com/query/69140/iitb-demo/version/latest";

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryDetails.query,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        console.error("GraphQL query error:", data.errors);
        return;
      }

      console.log("GraphQL query result:", data.data);

      const extractedColumns = Object.keys(data.data?.[queryDetails.queryName]?.[0] || {});
      const extractedRows = data.data?.[queryDetails.queryName] || [];

      setColumnsDataList(extractedColumns);
      setRowsDataList(extractedRows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching GraphQL data:", error);
    }
  };

  useEffect(() => {
    fetchGraphQLData();
  }, []);

  return (
    <main className={styles.mainContainer}>
      {loading ? (
        <p className="text-xl  text-slate-200 text-center font-bold">Fetching...</p>
      ) : (
        <>
          <h1 className="text-xl text-slate-200 font-bold py-2 px-[15px]">{queryDetails.queryName}</h1>
          <ResultTable
            columnsData={columnsDataList}
            rowsData={rowsDataList}
          />
        </>
      )}
    </main>
  );
}
