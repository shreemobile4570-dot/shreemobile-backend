// const bodyParser = require("body-parser");
// const express = require("express");
// const dotenv = require("dotenv");
// const dbConnect = require("./config/dbConnect");
// const { notFound, errorHandler } = require("./middlewares/errorHandler");
// const app = express();

// // Load environment variables
// const dotenvResult = dotenv.config({ path: __dirname + "/config.env" });
// if (dotenvResult.error) {
//   console.log("No config.env file found, using process.env variables");
// }

// const PORT = process.env.PORT || 5000;
// const authRouter = require("./routes/authRoute");
// const productRouter = require("./routes/productRoute");
// const blogRouter = require("./routes/blogRoute");
// const categoryRouter = require("./routes/prodcategoryRoute");
// const blogcategoryRouter = require("./routes/blogCatRoute");
// const brandRouter = require("./routes/brandRoute");
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");
// const couponRouter = require("./routes/couponRoute");
// const uploadRouter = require("./routes/uploadRoute");
// const cookieParser = require("cookie-parser");
// const morgan = require("morgan");
// const cors = require("cors");



// dbConnect();
// app.use(morgan("dev"));
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'API is running!'
//   });
// });

// app.use("/api/user", authRouter);
// app.use("/api/product", productRouter);
// app.use("/api/blog", blogRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/blogcategory", blogcategoryRouter);
// app.use("/api/brand", brandRouter);
// app.use("/api/coupon", couponRouter);
// app.use("/api/color", colorRouter);
// app.use("/api/enquiry", enqRouter);
// app.use("/api/upload", uploadRouter);

// app.use(notFound);
// app.use(errorHandler);
// module.exports = app;

const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Load environment variables
const dotenvResult = dotenv.config({ path: __dirname + "/config.env" });
if (dotenvResult.error) {
  console.log("No config.env file found, using process.env variables");
}

const PORT = process.env.PORT || 5000;

// Routes
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");

// Middlewares
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// Connect DB
dbConnect();

// Logging
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://shree-ecom-frontend.vercel.app",
  "https://shree-mobile-admin.vercel.app",
  "https://shree-mobile-admin-git-main-neelkhots-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    const isAllowedVercelPreview =
      origin &&
      /^https:\/\/shree-mobile-admin.*\.vercel\.app$/.test(origin);

    if (!origin || allowedOrigins.includes(origin) || isAllowedVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));


// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // local dev (Vite)
//       "http://localhost:3000", // optional
//       "https://shree-ecom-frontend.vercel.app", 
//       "https://shree-mobile-admin.vercel.app/",// ✅ YOUR FRONTEND
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// Handle preflight requests
app.options("*", cors(corsOptions));

//asdfasdfas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());


app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running!",
  });
});

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);


app.use(notFound);
app.use(errorHandler);

module.exports = app;
