import * as fs from "fs";
import { skillCompetenciesScript, reportScript, detailedSkillCompetenciesScript, componentsScript } from "./scriptInjections.js";

const USE_MOCK_DATA = true;
const OUTPUT_FILENAME = "src/index.html";
const PAGE_TITLE = "Custom Profile";
const BIND_DEFINES = {
  fname: "fname",
  date: "date",
  pages: "pages",
  skills: "skills",
  competencies: "competencies",
  skillChart: "skill-chart",
  competenciesChart: "competencies-chart",
};

function bindMyValue(bindingName: string): string {
  return `<%= ${bindingName} %>`;
}

function scriptDefines(): string {
  return `
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script> 
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Include datalabels plugin -->
  <style>
    @media print {
    html, body {
      font-family: 'Inter', sans-serif;
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

const HrSeperator = () => `<hr class="w-[40%] m-0 border-gray-500 opacity-50">`;

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
        <div class="flex-grow ml-auto">${ctn4Name}</div>
    </div>
    `;
}

function generateSummaryPage(): string {
  const logoSrc =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/1200px-Google_Images_2015_logo.svg.png";
  const firstFlexbox = `
        <div class="my-9 py-9">
            <img src="${logoSrc}" alt="logo" class="w-[140px] h-auto my-2 py-2">
            <div class="flex-1">
                <p class="text-lg font-semibold">${bindMyValue(
                  BIND_DEFINES.fname
                )}</p>
            </div>
            <div class="flex-1 text-gray-500">
                <p class="text-base">SCORE: Skills & Competencies Rating Exercise</p>
                <p class="text-base">Updated as of ${bindMyValue(
                  BIND_DEFINES.date
                )}</p>
            </div>
        </div>
    `;

  const recommendedCourses = `
    <div class="my-4">
        <p class="text-base font-semibold mb-4">Recommended Courses Summary</p>
        ${HrSeperator()}
    </div>
    `;

  const skillsCompetencies = `<div id='skills-competencies'></div>`;

  return firstFlexbox + recommendedCourses + skillsCompetencies;
}

function generateSkillsScoreReport(): string {
  return `
    <div class="my-4" style="text-align: left;">
      <div class="text-blue-800 my-4">Skills SCORE Report</div>
      ${HrSeperator()}
      <canvas id="radar-chart-skills" class="my-4"></canvas>
      ${HrSeperator()}
    </div>`;
}

function generateCompetenciesScoreReport(): string {
  return `
    <div class="my-4" style="text-align: left;">
      <div class="text-red-800 my-4">Competencies SCORE Report</div>
      ${HrSeperator()}
      <canvas id="radar-chart-competencies" class="my-4"></canvas>
      ${HrSeperator()}
    </div>`;
}

function createCategoryList(name: string, index: number): string {
  const separator = String.fromCharCode(65 + index);
  return `<div class="" data-index="${index}">
<p class="text-gray-700 text-md"><span class="font-bold text-base">${separator}.</span> ${name}</p>
</div>`;
}
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
    <div class="flex items-center justify-between min-w-[200px] max-w-[288px] ${borderClass} ${bgClass} rounded-lg m-1 py-1 px-2" style="border-width: 1px;">
      <p class="flex-1 text-xs font-semibold ${textClass}">${text}</p>
      <a href="${hyperlink}" class="text-xs ${textClass}">
        <svg class="opacity-50" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14 5C13.4477 5 13 4.55228 13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6.41421L11.7071 13.7071C11.3166 14.0976 10.6834 14.0976 10.2929 13.7071C9.90237 13.3166 9.90237 12.6834 10.2929 12.2929L17.5858 5H14ZM5 7C4.44772 7 4 7.44772 4 8V19C4 19.5523 4.44772 20 5 20H16C16.5523 20 17 19.5523 17 19V14.4375C17 13.8852 17.4477 13.4375 18 13.4375C18.5523 13.4375 19 13.8852 19 14.4375V19C19 20.6569 17.6569 22 16 22H5C3.34315 22 2 20.6569 2 19V8C2 6.34315 3.34315 5 5 5H9.5625C10.1148 5 10.5625 5.44772 10.5625 6C10.5625 6.55228 10.1148 7 9.5625 7H5Z" fill="${svgFill}"/>
        </svg>
      </a>
    </div>
  `;
}

function generateSkillsDetails(): string {
  return `<div id="details-skills"></div>`;
}

function generateCompetenciesDetails(): string {
  return `<div id="details-competencies"></div>`;
}

const createSkillBandInfo = () => {
  const mockSkillsBandingData = [
    {
      name: "Digital Dexterity",
      bandings: {
        1: {
          requirements: "Basic awareness of digital tools and technologies, with an ability to use them for simple tasks.",
        },
        2: {
          requirements: "Ability to effectively use digital tools for routine tasks, with some understanding of their functionalities and integration.",
        },
        3: {
          requirements: "Proficient in using digital tools to optimize daily tasks; familiar with multiple tools and how they integrate in a digital workspace.",
        },
        4: {
          requirements: "Advanced proficiency in utilizing digital tools for complex tasks, with an understanding of automation and integration across platforms.",
        },
        5: {
          requirements: "Expert in integrating and managing multiple digital tools, utilizing them for strategic decision-making and workflow optimization.",
        },
        6: {
          requirements: "Thought leader in digital technologies; able to guide and train others, driving innovation and transformation in the digital workspace.",
        },
      },
    },
    {
      name: "Communication Skills",
      bandings: {
        1: {
          requirements: "Able to clearly communicate basic ideas in written and verbal formats, with some awareness of audience and context.",
        },
        2: {
          requirements: "Able to convey ideas and information clearly in both written and verbal formats, understanding the importance of tone and clarity for different audiences.",
        },
        3: {
          requirements: "Skilled in communicating complex ideas effectively; adjusts communication style to suit the audience and context.",
        },
        4: {
          requirements: "Expert communicator, able to engage diverse audiences and effectively manage difficult conversations or negotiations.",
        },
        5: {
          requirements: "Able to lead communication strategies, influencing key stakeholders and guiding teams through complex projects and discussions.",
        },
        6: {
          requirements: "A recognized thought leader in communication, shaping organizational strategies, culture, and aligning teams through effective communication.",
        },
      },
    },
    {
      name: "Problem Solving",
      bandings: {
        1: {
          requirements: "Able to approach simple problems with standard solutions, using basic critical thinking skills.",
        },
        2: {
          requirements: "Able to identify problems and propose logical solutions, using basic analysis and reasoning.",
        },
        3: {
          requirements: "Able to tackle complex problems by breaking them down into smaller components and applying structured problem-solving techniques.",
        },
        4: {
          requirements: "Proficient at addressing complex and ambiguous problems, with an ability to synthesize information and propose innovative solutions.",
        },
        5: {
          requirements: "Able to solve high-impact problems that influence strategic decisions, leveraging advanced problem-solving frameworks and techniques.",
        },
        6: {
          requirements: "Recognized as an expert in problem solving, able to guide teams through the most challenging and ambiguous issues, driving organizational change.",
        },
      },
    },
    {
      name: "Leadership",
      bandings: {
        1: {
          requirements: "Demonstrates basic leadership qualities, including the ability to manage small teams and make decisions for routine tasks.",
        },
        2: {
          requirements: "Able to lead teams for more complex projects, taking responsibility for decisions and providing guidance for others.",
        },
        3: {
          requirements: "Skilled in leading teams of varying sizes, ensuring alignment to organizational goals and adapting leadership style to meet team needs.",
        },
        4: {
          requirements: "Able to lead cross-functional teams, aligning multiple stakeholders and fostering collaboration to drive major initiatives and strategic outcomes.",
        },
        5: {
          requirements: "A strong strategic leader, able to lead large teams or departments, develop organizational strategies, and manage complex change initiatives.",
        },
        6: {
          requirements: "Visionary leader, able to inspire and drive transformation at an organizational level, influencing culture, and shaping the future direction of the company.",
        },
      },
    },
    {
      name: "Project Management",
      bandings: {
        1: {
          requirements: "Able to manage basic projects with clear goals, deadlines, and deliverables, using basic project management tools.",
        },
        2: {
          requirements: "Capable of managing more complex projects, ensuring deliverables are met within scope, time, and budget constraints.",
        },
        3: {
          requirements: "Experienced in managing projects with multiple stakeholders, risks, and changing requirements, while maintaining focus on outcomes.",
        },
        4: {
          requirements: "Able to lead large, cross-functional projects, managing project teams, resources, and timelines to deliver strategic business results.",
        },
        5: {
          requirements: "Skilled in overseeing a portfolio of projects, with an ability to optimize resource allocation, manage interdependencies, and mitigate risks.",
        },
        6: {
          requirements: "A recognized expert in project management, capable of leading large-scale, transformative initiatives and guiding others in advanced project management methodologies.",
        },
      },
    },
  ]
  const mockCompetenciesBandingData = mockSkillsBandingData;

  const bandingElements = mockSkillsBandingData
  .map((element, index) => {
    const { name, bandings } = element;
    return `
    <div class="mt-2 mb-8">${createCategoryList(name, index)}
    <div class="m-4 p-0 bg-white border border-gray-300 rounded-lg overflow-hidden">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-black text-white">
              <th class="px-4 py-2 text-center text-xs">BAND</th>
              <th class="px-4 py-2 text-left text-xs">REQUIREMENTS</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(bandings)
              .map(
                ([banding, { requirements }]) => `
                  <tr class="border-t border-gray-300">
                    <td class="px-4 py-2 text-center text-xs">${banding}</td>
                    <td class="px-4 py-2 text-xs">${requirements}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
        </div>
        </div>
    `;
  })
  .join("");

return `
    <div>
    <p>Skill Banding Structure</p>
    ${bandingElements}
  </div>
`;

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
<body class="m-4 p-4">
    ${bodyContent}
</body>
  ${componentsScript()}
  ${skillCompetenciesScript(
    BIND_DEFINES.skills,
    BIND_DEFINES.competencies,
    USE_MOCK_DATA
  )}
  ${reportScript(BIND_DEFINES.skillChart, BIND_DEFINES.competenciesChart, USE_MOCK_DATA)}
  ${detailedSkillCompetenciesScript(BIND_DEFINES.skills, BIND_DEFINES.competencies, USE_MOCK_DATA)}
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
      <div class="break-after-page">
      ${generateSummaryPage()}
      </div>

      <div class="break-before-page">
      ${generateSkillsScoreReport()}
      </div>

      ${generateSkillsDetails()}

      <div class="break-before-page">
      ${generateCompetenciesScoreReport()}

      ${generateCompetenciesDetails()}

      ${createSkillBandInfo()}
      </div>
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
