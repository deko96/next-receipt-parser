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

const data = [
  {
    id: "item1",
    name: "Toaletna",
    category: "Food",
    price: 15,
  },
  {
    id: "item2",
    name: "Coca Cola",
    category: "Drinks",
    price: 0.5,
  },
  {
    id: "item3",
    name: "Fanta",
    category: "Drinks",
    price: 10,
  },
  {
    id: "item4",
    name: "Sprite",
    category: "Drinks",
    price: 10,
  },
  {
    id: "item5",
    name: "Macbook Air Pro 2023",
    category: "Electronics",
    price: 1250,
  },
];

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
    if (!result[item.category]) {
      result[item.category] = [];
    }
    result[item.category].push(item);
    return result;
  }, {});
  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items,
  }));
};

const getTotalPrice = (data) => {
  return data.reduce((total, item) => total + item.price, 0);
};

export default function Receipt() {
  const groupedData = groupItemsByCategory(data);
  const total = getTotalPrice(data);

  return (
    <Container maxWidth="xl" style={{ display: "flex" }}>
      <div style={{ flex: 3, marginRight: "16px" }}>
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

      <div
        style={{
          flex: 7,
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <strong>Total:</strong>
                </TableCell>
                <TableCell>
                  <strong>${total}</strong>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}
