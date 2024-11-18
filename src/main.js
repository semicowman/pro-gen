import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import ejs from "ejs";

// Function to format a URL as a valid filename
function formatUrlToFilename(url) {
  return url
    .replace(/https?:\/\//, "") // Remove protocol (http:// or https://)
    .replace(/[\/:?#&]/g, "_") // Replace invalid filename characters with '_'
    .replace(/\s+/g, "_"); // Replace spaces with underscores
}

function formatFileToFilename(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath)); // Get the file name without extension
  return baseName.replace(/\s+/g, "_"); // Replace spaces with underscores
}

async function printPDF(url) {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto(url, { waitUntil: "networkidle0" });

  // Create the PDF and return it as a buffer (in-memory)
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  // Close the browser instance
  await browser.close();

  return pdfBuffer;
}

async function generatePDFs(urls) {
  for (const url of urls) {
    try {
      const pdfBuffer = await printPDF(url);
      const filename = formatUrlToFilename(url) + ".pdf";
      const outputPath = filename;

      // Save the buffer to a file
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log(`PDF saved successfully as ${filename}`);
    } catch (error) {
      console.error(`Error generating PDF for ${url}:`, error);
    }
  }
}

// List of URLs to create PDFs for
const urls = [
  "https://blog.risingstack.com",
  "https://www.amazon.com/",
  "https://www.yahoo.com",
];

// generatePDFs(urls);

async function printPDFFromFile(filePath) {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  // Load the local HTML file
  const fileUrl = `file://${path.resolve(filePath)}`;
  await page.goto(fileUrl, { waitUntil: "networkidle0" });

  // Create the PDF and return it as a buffer (in-memory)
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    scale: 1,
    margin: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
  });

  // Close the browser instance
  await browser.close();

  return pdfBuffer;
}

async function printPDFFromTemplate(templatePath) {
  const htmlContent = await ejs.renderFile(templatePath, {
    fname: "TESTING FNAME",
    date: "2023-06-30",
    pages: "0",
    skills: [
      {
        name: "Digital Dexterity",
        score: {
          prev: 3,
          target: 5,
          current: 4,
        },
        requirements:
          "Understanding and utilizing modern digital tools and technologies.",
        courses: [
          {
            name: "Introduction to Digital Tools",
            url: "https://www.example.com/course1",
          },
          {
            name: "Advanced Digital Skills for Professionals",
            url: "https://www.example.com/course2",
          },
        ],
      },
      {
        name: "Legal Project Management",
        score: {
          prev: 4,
          target: 6,
          current: 5,
        },
        requirements:
          "Effective management of legal projects, teams, and resources.",
        courses: [
          {
            name: "Legal Project Management Fundamentals",
            url: "https://www.example.com/course3",
          },
          {
            name: "Managing Legal Risks",
            url: "https://www.example.com/course4",
          },
        ],
      },
      {
        name: "Business Development",
        score: {
          prev: 2,
          target: 4,
          current: 3,
        },
        requirements:
          "Understanding of market trends and ability to develop strategies to grow business.",
        courses: [
          {
            name: "Market Analysis and Business Strategies",
            url: "https://www.example.com/course5",
          },
          {
            name: "Advanced Business Development Techniques",
            url: "https://www.example.com/course6",
          },
        ],
      },
    ],
    competencies: [
      {
        name: "Collaboration & Teamwork",
        score: {
          prev: 5,
          target: 6,
          current: 5,
        },
        requirements:
          "Ability to work effectively with others to achieve common goals.",
        courses: [
          {
            name: "Team Collaboration in the Workplace",
            url: "https://www.example.com/course7",
          },
          {
            name: "Effective Communication in Teams",
            url: "https://www.example.com/course8",
          },
        ],
      },
      {
        name: "Leadership",
        score: {
          prev: 4,
          target: 7,
          current: 6,
        },
        requirements:
          "Inspiring and leading teams towards success, with focus on decision-making and management.",
        courses: [
          {
            name: "Leadership Essentials",
            url: "https://www.example.com/course9",
          },
          {
            name: "Strategic Leadership Skills",
            url: "https://www.example.com/course10",
          },
        ],
      },
      {
        name: "Networking",
        score: {
          prev: 3,
          target: 5,
          current: 4,
        },
        requirements:
          "Building and maintaining professional relationships that benefit career growth.",
        courses: [
          {
            name: "Networking Strategies for Career Growth",
            url: "https://www.example.com/course11",
          },
          {
            name: "Mastering Professional Networking",
            url: "https://www.example.com/course12",
          },
        ],
      },
    ],
    skillChart: {
      dataset: [
        [1, 2, 3, 1, 2, 2, 3],
        [3, 4, 5, 4, 5, 5, 4],
        [4, 5, 5, 5, 5, 5, 4],
      ],
      labels: [
        "Digital Dexterity",
        "Legal Project Management",
        "Commercial Risk Assessment for Clients",
        "Business Development",
        "Business Partnering",
        "Process Improvement",
        "Design Thinking & Legal Design",
      ],
    },
    competenciesChart: {
      dataset: [
        [1, 2, 3, 1, 2, 2, 3],
        [3, 4, 5, 4, 5, 5, 4],
        [4, 5, 5, 5, 5, 5, 4],
      ],
      labels: [
        "Digital Dexterity",
        "Legal Project Management",
        "Commercial Risk Assessment for Clients",
        "Business Development",
        "Business Partnering",
        "Process Improvement",
        "Design Thinking & Legal Design",
      ],
    },
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(htmlContent);

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    scale: 1,
    margin: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
  });

  await browser.close();
  return pdfBuffer;
}

async function generatePDFsFromFile(filePaths) {
  for (const filePath of filePaths) {
    try {
      const pdfBuffer = await printPDFFromTemplate(filePath);
      const filename = formatFileToFilename(filePath) + ".pdf";
      const outputPath = path.join(path.dirname(filePath), filename);

      // Save the buffer to a file
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log(`PDF saved successfully as ${filename}`);
    } catch (error) {
      console.error(`Error generating PDF for ${filePath}:`, error);
    }
  }
}

const filePaths = [
  // 'test.html',
  "src/index.html",
];

// Run the function to generate PDFs for each URL
generatePDFsFromFile(filePaths);
