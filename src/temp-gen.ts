import * as fs from "fs";
import {
  skillCompetenciesScript,
  reportScript,
  detailedSkillCompetenciesScript,
  componentsScript,
  bandingScript,
} from "./scriptInjections.js";

const USE_MOCK_DATA = false;
const OUTPUT_FILENAME = "src/index.html";
const PAGE_TITLE = "Custom Profile";
const BIND_DEFINES = {
  fname: "fname",
  date: "date",
  pages: "pages",
  skills: "skills",
  competencies: "competencies",
  skillChart: "skillChart",
  competenciesChart: "competenciesChart",
  bandingSkills: "bandingSkills",
  bandingCompetencies: "bandingCompetencies",
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
    <div class="flex w-full text-xs !text-[0.6rem] m-2 p-2 gap-2">
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
            <div class="flex-1 mb-4">
                <p class="text-lg font-medium">${bindMyValue(
                  BIND_DEFINES.fname
                )}</p>
            </div>
            <div class="flex-1 text-gray-500">
                <p class="text-xs font-medium">SCORE: Skills & Competencies Rating Exercise</p>
                <p class="text-xs font-medium">Updated as of ${bindMyValue(
                  BIND_DEFINES.date
                )}</p>
            </div>
        </div>
    `;

  const recommendedCourses = `
    <div class="my-4">
        <p class="text-base font-medium mb-4">Recommended Courses Summary</p>
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

function generateSkillsDetails(): string {
  return `<div id="details-skills"></div>`;
}

function generateCompetenciesDetails(): string {
  return `<div id="details-competencies"></div>`;
}

const generateSkillsBandInfo = () => {
  return `
    <div class="my-4 pr-6">
    <p class="text-blue-800 my-4">Skill Banding Structure</p>
    ${HrSeperator()}
    <div class="my-4"></div>
    <div id="banding-skills"></div>
  </div>
`;
};

const generateCompetenciesBandInfo = () => {
  return `
      <div class="my-4 pr-6">
      <p class="text-red-800 my-4">Competencies Banding Structure</p>
      ${HrSeperator()}
      <div class="my-4"></div>
      <div id="banding-competencies"></div>
    </div>
  `;
};

function generateHtmlFile(
  filename: string,
  title: string,
  bodyContent: string
): void {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  ${reportScript(
    BIND_DEFINES.skillChart,
    BIND_DEFINES.competenciesChart,
    USE_MOCK_DATA
  )}
  ${detailedSkillCompetenciesScript(
    BIND_DEFINES.skills,
    BIND_DEFINES.competencies,
    USE_MOCK_DATA
  )}
  ${bandingScript(
    BIND_DEFINES.bandingSkills,
    BIND_DEFINES.bandingCompetencies,
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
      <div class="break-after-page">
      ${generateSummaryPage()}
      </div>

      <div class="break-before-page">
      ${generateSkillsScoreReport()}
      </div>

      ${generateSkillsDetails()}

      <div class="break-before-page">
      ${generateCompetenciesScoreReport()}
      </div>

      ${generateCompetenciesDetails()}

      <div class="break-before-page">
      ${generateSkillsBandInfo()}
      </div>

      <div class="break-before-page">
      ${generateCompetenciesBandInfo()}
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
