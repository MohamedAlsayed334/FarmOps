import { tables } from '@/lib/schema';

export async function generateStaticParams() {
  return Object.keys(tables).map((tableName) => ({
    tableName: tableName,
  }));
}

export default function TableLayout({ children }) {
  return <>{children}</>;
}