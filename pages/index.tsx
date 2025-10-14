
import type { GetServerSideProps } from "next";

export default function Index(): null {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const def = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";
  return {
    redirect: { destination: `/${def}`, permanent: false }
  };
};
