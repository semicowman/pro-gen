import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.min.mjs";

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
    deviceScaleFactor: 2,
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
    bandingSkills: [
      {
        name: "Digital Dexterity",
        score: {
          current: 3,
          prev: 2,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Basic awareness of digital tools and technologies, with an ability to use them for simple tasks.",
          },
          2: {
            requirements:
              "Ability to effectively use digital tools for routine tasks, with some understanding of their functionalities and integration.",
          },
          3: {
            requirements:
              "Proficient in using digital tools to optimize daily tasks; familiar with multiple tools and how they integrate in a digital workspace.",
          },
          4: {
            requirements:
              "Advanced proficiency in utilizing digital tools for complex tasks, with an understanding of automation and integration across platforms.",
          },
          5: {
            requirements:
              "Expert in integrating and managing multiple digital tools, utilizing them for strategic decision-making and workflow optimization.",
          },
          6: {
            requirements:
              "Thought leader in digital technologies; able to guide and train others, driving innovation and transformation in the digital workspace.",
          },
        },
      },
      {
        name: "Communication Skills",
        score: {
          current: 4,
          prev: 3,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to clearly communicate basic ideas in written and verbal formats, with some awareness of audience and context.",
          },
          2: {
            requirements:
              "Able to convey ideas and information clearly in both written and verbal formats, understanding the importance of tone and clarity for different audiences.",
          },
          3: {
            requirements:
              "Skilled in communicating complex ideas effectively; adjusts communication style to suit the audience and context.",
          },
          4: {
            requirements:
              "Expert communicator, able to engage diverse audiences and effectively manage difficult conversations or negotiations.",
          },
          5: {
            requirements:
              "Able to lead communication strategies, influencing key stakeholders and guiding teams through complex projects and discussions.",
          },
          6: {
            requirements:
              "A recognized thought leader in communication, shaping organizational strategies, culture, and aligning teams through effective communication.",
          },
        },
      },
      {
        name: "Problem Solving",
        score: {
          current: 5,
          prev: 4,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to approach simple problems with standard solutions, using basic critical thinking skills.",
          },
          2: {
            requirements:
              "Able to identify problems and propose logical solutions, using basic analysis and reasoning.",
          },
          3: {
            requirements:
              "Able to tackle complex problems by breaking them down into smaller components and applying structured problem-solving techniques.",
          },
          4: {
            requirements:
              "Proficient at addressing complex and ambiguous problems, with an ability to synthesize information and propose innovative solutions.",
          },
          5: {
            requirements:
              "Able to solve high-impact problems that influence strategic decisions, leveraging advanced problem-solving frameworks and techniques.",
          },
          6: {
            requirements:
              "Recognized as an expert in problem solving, able to guide teams through the most challenging and ambiguous issues, driving organizational change.",
          },
        },
      },
      {
        name: "Leadership",
        score: {
          current: 6,
          prev: 5,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Demonstrates basic leadership qualities, including the ability to manage small teams and make decisions for routine tasks.",
          },
          2: {
            requirements:
              "Able to lead teams for more complex projects, taking responsibility for decisions and providing guidance for others.",
          },
          3: {
            requirements:
              "Skilled in leading teams of varying sizes, ensuring alignment to organizational goals and adapting leadership style to meet team needs.",
          },
          4: {
            requirements:
              "Able to lead cross-functional teams, aligning multiple stakeholders and fostering collaboration to drive major initiatives and strategic outcomes.",
          },
          5: {
            requirements:
              "A strong strategic leader, able to lead large teams or departments, develop organizational strategies, and manage complex change initiatives.",
          },
          6: {
            requirements:
              "Visionary leader, able to inspire and drive transformation at an organizational level, influencing culture, and shaping the future direction of the company.",
          },
        },
      },
      {
        name: "Project Management",
        score: {
          current: 5,
          prev: 3,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Able to manage basic projects with clear goals, deadlines, and deliverables, using basic project management tools.",
          },
          2: {
            requirements:
              "Capable of managing more complex projects, ensuring deliverables are met within scope, time, and budget constraints.",
          },
          3: {
            requirements:
              "Experienced in managing projects with multiple stakeholders, risks, and changing requirements, while maintaining focus on outcomes.",
          },
          4: {
            requirements:
              "Able to lead large, cross-functional projects, managing project teams, resources, and timelines to deliver strategic business results.",
          },
          5: {
            requirements:
              "Skilled in overseeing a portfolio of projects, with an ability to optimize resource allocation, manage interdependencies, and mitigate risks.",
          },
          6: {
            requirements:
              "A recognized expert in project management, capable of leading large-scale, transformative initiatives and guiding others in advanced project management methodologies.",
          },
        },
      },
    ],
    bandingCompetencies: [
      {
        name: "Digital Dexterity",
        score: {
          current: 3,
          prev: 2,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Basic awareness of digital tools and technologies, with an ability to use them for simple tasks.",
          },
          2: {
            requirements:
              "Ability to effectively use digital tools for routine tasks, with some understanding of their functionalities and integration.",
          },
          3: {
            requirements:
              "Proficient in using digital tools to optimize daily tasks; familiar with multiple tools and how they integrate in a digital workspace.",
          },
          4: {
            requirements:
              "Advanced proficiency in utilizing digital tools for complex tasks, with an understanding of automation and integration across platforms.",
          },
          5: {
            requirements:
              "Expert in integrating and managing multiple digital tools, utilizing them for strategic decision-making and workflow optimization.",
          },
          6: {
            requirements:
              "Thought leader in digital technologies; able to guide and train others, driving innovation and transformation in the digital workspace.",
          },
        },
      },
      {
        name: "Communication Skills",
        score: {
          current: 4,
          prev: 3,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to clearly communicate basic ideas in written and verbal formats, with some awareness of audience and context.",
          },
          2: {
            requirements:
              "Able to convey ideas and information clearly in both written and verbal formats, understanding the importance of tone and clarity for different audiences.",
          },
          3: {
            requirements:
              "Skilled in communicating complex ideas effectively; adjusts communication style to suit the audience and context.",
          },
          4: {
            requirements:
              "Expert communicator, able to engage diverse audiences and effectively manage difficult conversations or negotiations.",
          },
          5: {
            requirements:
              "Able to lead communication strategies, influencing key stakeholders and guiding teams through complex projects and discussions.",
          },
          6: {
            requirements:
              "A recognized thought leader in communication, shaping organizational strategies, culture, and aligning teams through effective communication.",
          },
        },
      },
      {
        name: "Problem Solving",
        score: {
          current: 5,
          prev: 4,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Able to approach simple problems with standard solutions, using basic critical thinking skills.",
          },
          2: {
            requirements:
              "Able to identify problems and propose logical solutions, using basic analysis and reasoning.",
          },
          3: {
            requirements:
              "Able to tackle complex problems by breaking them down into smaller components and applying structured problem-solving techniques.",
          },
          4: {
            requirements:
              "Proficient at addressing complex and ambiguous problems, with an ability to synthesize information and propose innovative solutions.",
          },
          5: {
            requirements:
              "Able to solve high-impact problems that influence strategic decisions, leveraging advanced problem-solving frameworks and techniques.",
          },
          6: {
            requirements:
              "Recognized as an expert in problem solving, able to guide teams through the most challenging and ambiguous issues, driving organizational change.",
          },
        },
      },
      {
        name: "Leadership",
        score: {
          current: 6,
          prev: 5,
          target: 6,
        },
        bandings: {
          1: {
            requirements:
              "Demonstrates basic leadership qualities, including the ability to manage small teams and make decisions for routine tasks.",
          },
          2: {
            requirements:
              "Able to lead teams for more complex projects, taking responsibility for decisions and providing guidance for others.",
          },
          3: {
            requirements:
              "Skilled in leading teams of varying sizes, ensuring alignment to organizational goals and adapting leadership style to meet team needs.",
          },
          4: {
            requirements:
              "Able to lead cross-functional teams, aligning multiple stakeholders and fostering collaboration to drive major initiatives and strategic outcomes.",
          },
          5: {
            requirements:
              "A strong strategic leader, able to lead large teams or departments, develop organizational strategies, and manage complex change initiatives.",
          },
          6: {
            requirements:
              "Visionary leader, able to inspire and drive transformation at an organizational level, influencing culture, and shaping the future direction of the company.",
          },
        },
      },
      {
        name: "Project Management",
        score: {
          current: 5,
          prev: 3,
          target: 5,
        },
        bandings: {
          1: {
            requirements:
              "Able to manage basic projects with clear goals, deadlines, and deliverables, using basic project management tools.",
          },
          2: {
            requirements:
              "Capable of managing more complex projects, ensuring deliverables are met within scope, time, and budget constraints.",
          },
          3: {
            requirements:
              "Experienced in managing projects with multiple stakeholders, risks, and changing requirements, while maintaining focus on outcomes.",
          },
          4: {
            requirements:
              "Able to lead large, cross-functional projects, managing project teams, resources, and timelines to deliver strategic business results.",
          },
          5: {
            requirements:
              "Skilled in overseeing a portfolio of projects, with an ability to optimize resource allocation, manage interdependencies, and mitigate risks.",
          },
          6: {
            requirements:
              "A recognized expert in project management, capable of leading large-scale, transformative initiatives and guiding others in advanced project management methodologies.",
          },
        },
      },
    ],
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
      right: "0mm",
      bottom: "0mm",
      left: "0mm",
    },
  });

  await browser.close();
  return pdfBuffer;
}

async function extractPdfData(pdfBuffer) {
  const pdf = await getDocument(pdfBuffer).promise;
  const extractedStrings = [];
  let prevValue = "";
  let newValue = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const textContent = await page.getTextContent();
    const textItems = textContent.items.map(item => item.str);
    const pageText = textItems.join(' ');

    if (pageNum == 1) {
      newValue = "introduction"
    } else if (pageText.includes("Skills SCORE Report") || pageText.includes("Skill Banding Structure")) {
      newValue = "skills"
    } else if (pageText.includes("Competencies SCORE Report") || pageText.includes("Competencies Banding Structure")) {
      newValue = "competencies"
    } else {
      newValue = prevValue
    }

    extractedStrings.push(newValue);
    prevValue = newValue
  }

  return extractedStrings;
}

const modifyPdfHeaders = async (name, extractedHeadingTitles) => {
  const existingPdfBytes = fs.readFileSync('src/index.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  pages.forEach((page, pageIndex) => {
    const { width, height } = page.getSize();

    const headers = extractedHeadingTitles
    const title = headers[pageIndex].toUpperCase().split('')

    const backgroundColor = rgb(0.941, 0.941, 0.941);
    const textColor = rgb(0, 0, 0);
    const subtextColor = rgb(0.5, 0.5, 0.5);
    const textSize = 8;
    const titleColor = headers[pageIndex].toLowerCase() === "skills"
    ? rgb(21 / 255, 58 / 255, 124 / 255)
    : headers[pageIndex].toLowerCase() === "competencies"
    ? rgb(153 / 255, 27 / 255, 27 / 255)
    : textColor;  
    
    const startingHeight = height - 30
    const startingTextPosition = 30;
    const textSpacing = 20

    const backFillPuppeteerMargins = () => {
      page.drawRectangle({
        x: 0,
        y: height - 60,
        width: 1000,
        height: 500,
        color: backgroundColor,
      });
    }

    const drawTexts = () => {
      // const firstTextWidth = font.widthOfTextAtSize(title, textHeight);
      // page.drawText(title, {
        // x: startingTextPosition,
        // y: startingHeight,
        // size: textSize+2,
        // font: font,
        // color: textColor, 
      // });
      let xStart = startingTextPosition
      title.forEach((character, index) => {
        const kerning = 1;
        const charWidth = font.widthOfTextAtSize(character, textSize)
        
        page.drawText(character, {
          x: xStart,
          y: startingHeight,
          size: textSize,
          font: font,
          color: titleColor, 
        })
    
        xStart += charWidth + kerning
      })

      const standardTextSize = 8;
      const secondTextWidth = font.widthOfTextAtSize(name, standardTextSize);
      page.drawText(name, {
        x: startingTextPosition * 3 + textSpacing,
        y: startingHeight,
        size: textSize,
        font: font,
        color: subtextColor
      });

      const currentDate = new Date().toLocaleString()
      const thirdTextWidth = font.widthOfTextAtSize(currentDate, standardTextSize);
      page.drawText(currentDate, {
        x: startingTextPosition * 5 + textSpacing,
        y: startingHeight,
        size: textSize,
        font: font,
        color: subtextColor
      });

      page.drawEllipse({
        x: startingTextPosition * 5.55,
        y: startingHeight + 2,
        xScale: 1,
        yScale: 1,
        color: subtextColor,
        opacity: 0.5
      });
      
      const pageTextWidth = font.widthOfTextAtSize((pageIndex+1).toString(), standardTextSize);
      page.drawText((pageIndex+1).toString(), {
        x: 550,
        y: startingHeight,
        size: textSize,
        font: boldFont,
        color: subtextColor,
      });
    }
    
    backFillPuppeteerMargins();
    drawTexts();


    if (
      (extractedHeadingTitles[pageIndex] === "skills" && extractedHeadingTitles[pageIndex + 1] === "competencies") ||
      (extractedHeadingTitles[pageIndex] === "competencies" && extractedHeadingTitles[pageIndex + 1] === "skills") ||
      pageIndex === pages.length - 1
    ) {
      page.drawRectangle({
        x: startingTextPosition,
        y: 0+60,
        width: 520,
        height: 1,
        color: rgb(0.5,0.5,0.5),
        opacity: 0.5
      });
    }
  });

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync('src/output-all-pages.pdf', modifiedPdfBytes);
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

      const extractedHeadingTitles = await extractPdfData(pdfBuffer);
      console.log("PDF data extracted successfully.");

      await modifyPdfHeaders("My name here", extractedHeadingTitles);
      console.log("PDF headers modified successfully.");
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