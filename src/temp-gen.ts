import * as fs from "fs";
import { skillCompetenciesScript, skillReportScript } from "./scriptInjections.js";

const USE_MOCK_DATA = true;
const OUTPUT_FILENAME = "src/index.html";
const PAGE_TITLE = "Custom Profile";
const BIND_DEFINES = {
  fname: "fname",
  date: "date",
  pages: "pages",
  skills: "skills",
  competencies: "competencies",
  chart: "chart",
  skillChart: "skill-chart",
  competenciesChart: "competencies-chart",
};

function bindMyValue(bindingName: string): string {
  return `<%= ${bindingName} %>`;
}

function scriptDefines(): string {
  return `
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script> 
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Include datalabels plugin -->
  <style>
    @media print {
    html, body {
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #f0f0f0;
    }
      canvas {
        width: 100%;
        height: auto;
      }
    }
  </style>
`;
}

const HrSeperator = () => `<hr class="w-[40%] m-0 border border-gray-500 opacity-50">`;

function createHeader(
  ctn1Name: string,
  ctn2Name: string,
  ctn3Name: string,
  ctn4Name: string
): string {
  return `
    <div class="flex w-full text-xs m-4 gap-2">
        <div class="basis-1/10">${ctn1Name}</div>
        <div class="basis-1/10 text-gray-500">${ctn2Name}</div>
        <div class="basis-1/10 text-gray-500">${ctn3Name}</div>
        <div class="flex-grow">
        // ${ctn4Name}
        </div>
    </div>
    `;
}

function generateSummaryPage(): string {
  const logoSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/1200px-Google_Images_2015_logo.svg.png";
  const firstFlexbox = `
        <div class="mb-4">
            <img src="${logoSrc}" alt="logo" class="w-[400px] h-auto">
            <div class="flex-1">
                <p class="text-lg font-semibold">${bindMyValue(
                  BIND_DEFINES.fname
                )}</p>
            </div>
            <div class="flex-1 text-gray-500">
                <p class="text-lg font-semibold">SCORE: Skills & Competencies Rating Exercise</p>
                <p class="text-sm">Updated as of ${bindMyValue(
                  BIND_DEFINES.date
                )}</p>
            </div>
        </div>
    `;

  const recommendedCourses = `
    <div class="mb-4">
        <h2 class="text-xl font-semibold">Recommended Courses Summary</h2>
        ${HrSeperator()}
    </div>
    `;

  const skillsCompetencies = `<div id='skills-competencies'></div>`;

  return firstFlexbox + recommendedCourses + skillsCompetencies;
}
    
function generateSkillsScoreReport(): string {
  return `
    <div class="m-4" style="text-align: left;">
      <div class="text-blue-800">Skills SCORE Report</div>
      ${HrSeperator()}
      <canvas id="radar-chart"></canvas>
      ${HrSeperator()}
    </div>`;
}

function detailedSkillCompetenciesScript(): any {
  const data = {
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
  };
  

  const createSkillInfo = (skill: any, index: number) => {
    function createSummaryTabs(text: any, category: string, hyperlink: any) {
      let borderClass, bgClass, textClass, svgFill;
      if (category.toLowerCase() === "skills") {
        borderClass = "border-blue-800";
        bgClass = "bg-blue-100";
        textClass = "text-blue-900";
        svgFill = "#1D4ED8";
      } else if (category.toLowerCase() === "competencies") {
        borderClass = "border-red-800";
        bgClass = "bg-red-100";
        textClass = "text-red-900";
        svgFill = "#B91C1C";
      } else {
        borderClass = "border-gray-800";
        bgClass = "bg-gray-100";
        textClass = "text-gray-900";
        svgFill = "#6B7280";
      }
      return `
        <div class="flex items-center justify-between min-w-[200px] max-w-[288px] ${borderClass} ${bgClass} rounded-lg m-4 p-2" style="border-width: 1px;">
          <p class="flex-1 text-xs font-semibold ${textClass}">${text}</p>
          <a href="${hyperlink}" class="text-xs ${textClass}">
            <svg class="opacity-50" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14 5C13.4477 5 13 4.55228 13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6.41421L11.7071 13.7071C11.3166 14.0976 10.6834 14.0976 10.2929 13.7071C9.90237 13.3166 9.90237 12.6834 10.2929 12.2929L17.5858 5H14ZM5 7C4.44772 7 4 7.44772 4 8V19C4 19.5523 4.44772 20 5 20H16C16.5523 20 17 19.5523 17 19V14.4375C17 13.8852 17.4477 13.4375 18 13.4375C18.5523 13.4375 19 13.8852 19 14.4375V19C19 20.6569 17.6569 22 16 22H5C3.34315 22 2 20.6569 2 19V8C2 6.34315 3.34315 5 5 5H9.5625C10.1148 5 10.5625 5.44772 10.5625 6C10.5625 6.55228 10.1148 7 9.5625 7H5Z" fill="${svgFill}"/>
            </svg>
          </a>
        </div>
      `;
    }
    const { name, requirements, courses } = skill

    return `
    <div class="m-2 p-4 bg-white rounded-lg">
      <h3 class="text-lg font-bold">${name}</h3>
      
      <div class="flex mt-2">
        <!-- First Row (Requirements and Recommended Courses) -->
        <div class="w-3/5 pr-4">
          <h4 class="font-semibold">Requirements</h4>
          <p class="text-gray-500">${requirements}</p>
        </div>
        <div class="w-2/5 pl-4">
          <h4 class="font-semibold">Recommended Courses</h4>
          <ul>
            ${courses.map((course: { url: any; name: any; }) => `<li><a href="${course.url}" class="text-blue-500">${createSummaryTabs(course.name, "skills", course.url)}</a></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
  
  }

  const skillElements = data.skills.map((skill, index) => {
    function createCategoryList(name: string, index: number): string {
      const separator = String.fromCharCode(65 + index);
      return `<div class="text-xs" data-index="${index}">
      <h4 class="text-gray-700"><span class="font-bold text-base">${separator}.</span> ${name}</h4>
      </div>`;
    }

    const { name, score } = skill
    return `<div class="m-4">
      ${createCategoryList(name, index)}
      <ul class="flex items-center space-x-2 p-2">
        <li style="color: grey">2023 Banding: <strong>${score.prev}</strong></li>
        <li><span class="w-1 h-1 bg-gray-400 rounded-full inline-block opacity-50"></span></li>
        <li style="color: #36A2EB">Current Banding: <strong>${score.current}</strong></li>
        <li><span class="w-1 h-1 bg-gray-400 rounded-full inline-block opacity-50"></span></li>
        <li style="color: #4BC0C0">Target Banding: <strong>${score.target}</strong></li>
      </ul>
      ${createSkillInfo(skill, index)}
    </div>`;
  }).join('');

  return `<div id='skills-details'>${skillElements}</div>`
}

function generateHtmlFile(
  filename: string,
  title: string,
  bodyContent: string
): void {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="wsidth=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${scriptDefines()}
</head>
<body>
    ${bodyContent}
</body>
  ${skillCompetenciesScript(
    BIND_DEFINES.skills,
    BIND_DEFINES.competencies,
    USE_MOCK_DATA
  )}
  ${skillReportScript(
    BIND_DEFINES.chart,
    USE_MOCK_DATA
  )}
</html>
`;

  fs.writeFileSync(filename, htmlTemplate, "utf-8");
  console.log(`HTML file '${filename}' generated successfully.`);
}

function bodyContent(): string {
  return `
    ${createHeader(
      "Introduction",
      bindMyValue(BIND_DEFINES.fname),
      bindMyValue(BIND_DEFINES.date),
      bindMyValue(BIND_DEFINES.pages)
    )}
    <div class="ml-2">
      ${generateSummaryPage()}
      ${generateSkillsScoreReport()}
      ${detailedSkillCompetenciesScript()}
    </div>
    `;
}

const runMyScript = () => {
  try {
    generateHtmlFile(OUTPUT_FILENAME, PAGE_TITLE, bodyContent());
    console.log("HTML file generated successfully.");
  } catch {
    console.error("Error generating HTML file.");
  }
};

runMyScript();
