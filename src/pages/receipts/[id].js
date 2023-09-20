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
} from "@mui/material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import { useMemo } from "react";
import dayjs from "dayjs";
import { COLORS } from "../../utils/chart-colors";

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
              {groupedData.map((_, index) => (
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
