import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  colors,
} from "@mui/material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import api from "@/services/api";
import { useMemo } from "react";
import dayjs from "dayjs";

const COLORS = [
  colors.blue[500],
  colors.green[500],
  colors.orange[500],
  colors.purple[500],
  colors.red[500],
  colors.yellow[500],
  colors.teal[500],
  colors.pink[500],
  colors.indigo[500],
  colors.cyan[500],
  colors.deepOrange[500],
  colors.amber[500],
  colors.lightBlue[500],
  colors.lime[500],
  colors.deepPurple[500],
  colors.brown[500],
  colors.grey[500],
  colors.blueGrey[500],
  colors.lightGreen[500],
  colors.deepPurple[300], // Additional unique color
  colors.blue[300], // Additional unique color
  colors.green[300], // Additional unique color
  colors.orange[300], // Additional unique color
  colors.purple[300], // Additional unique color
];

const groupItemsByCategory = (data) => {
  const grouped = data.reduce((result, item) => {
    const category = item.category?.name || "Other";
    if (!result[category]) result[category] = [];
    result[category].push(item);

    return result;
  }, {});

  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items,
  }));
};

export async function getServerSideProps({ params }) {
  const { data } = await api.get(`/receipts/${params.id}`);
  console.log(data);

  return {
    props: {
      data,
    },
  };
}

export default function Receipt({ data }) {
  const groupedData = groupItemsByCategory(data.items);

  const date = useMemo(() => {
    return data.date ? dayjs(data.date).format("DD.MM.YYYY") : "N/A";
  }, [data]);

  return (
    <Container
      maxWidth="xl"
      style={{ display: "flex", flexDirection: "column", gap: "50px" }}
    >
      <div>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              dataKey="items.length"
              nameKey="category"
              data={groupedData}
              outerRadius={100}
              label
            >
              {groupedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colspan={4}>Merchant</TableCell>
                <TableCell>{data.merchant || "Unknown"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan={4}>Date</TableCell>
                <TableCell>{date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan={5} align="center">
                  ITEMS
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Product Code</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.category?.name || "Other"}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.product_code || "N/A"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>${data.total}</strong>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}
