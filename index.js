const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const ensureDbConnected = require("./middlewares/dbMiddleware");

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
const sizeRouter = require("./routes/sizeRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");

// Middlewares
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// Connect DB
dbConnect().catch((error) => {
  console.error("Initial database connection failed:", error.message);
});

// Logging
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://shree-ecom-frontend.vercel.app",
  "https://shree-ecom-frontend-git-main-neelkhots-projects.vercel.app",
  "https://stri-ksham.vercel.app",
  "https://striksham-admin.vercel.app",
  "https://striksham.vercel.app",
  "https://shree-mobile-admin.vercel.app",
  "https://shree-mobile-admin-git-main-neelkhots-projects.vercel.app",
  "https://shree-mobiel.vercel.app/",
  "https://shreemobile-admin.vercel.app/",
];

const normalizeOrigin = (origin) => origin?.replace(/\/+$/, "");

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const normalizedOrigin = normalizeOrigin(origin);
  return (
    allowedOrigins.includes(normalizedOrigin) ||
    /^https:\/\/stri-ksham.*\.vercel\.app$/.test(normalizedOrigin) ||
    /^https:\/\/striksham.*\.vercel\.app$/.test(normalizedOrigin) ||
    /^https:\/\/striksham-admin.*\.vercel\.app$/.test(normalizedOrigin) ||
    /^https:\/\/shree-mobile.*\.vercel\.app$/.test(normalizedOrigin) ||
    /^https:\/\/shreemobile-admin.*\.vercel\.app$/.test(normalizedOrigin)
  );
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isOriginAllowed(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));




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

app.use("/api", ensureDbConnected);

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/size", sizeRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);


app.use(notFound);
app.use(errorHandler);

module.exports = app;
