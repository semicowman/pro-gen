const componentsScript = () => {
  return `
  <script>
    function getCategoryStyles(category) {
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

    return { borderClass, bgClass, textClass, svgFill };
  }

    function createSummaryTabs(text, category, hyperlink) {
      const { borderClass, bgClass, textClass, svgFill } = getCategoryStyles(category);

      return \`
        <div class="flex items-center justify-between min-w-[200px] max-w-[288px] \${borderClass} \${bgClass} rounded-lg m-1 py-1 px-2" style="border-width: 1px;">
            <p class="flex-1 text-xs font-semibold \${textClass}">\${text}</p>
            <a href="\${hyperlink}" class="text-xs \${textClass}">
<svg class="opacity-50" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14 5C13.4477 5 13 4.55228 13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6.41421L11.7071 13.7071C11.3166 14.0976 10.6834 14.0976 10.2929 13.7071C9.90237 13.3166 9.90237 12.6834 10.2929 12.2929L17.5858 5H14ZM5 7C4.44772 7 4 7.44772 4 8V19C4 19.5523 4.44772 20 5 20H16C16.5523 20 17 19.5523 17 19V14.4375C17 13.8852 17.4477 13.4375 18 13.4375C18.5523 13.4375 19 13.8852 19 14.4375V19C19 20.6569 17.6569 22 16 22H5C3.34315 22 2 20.6569 2 19V8C2 6.34315 3.34315 5 5 5H9.5625C10.1148 5 10.5625 5.44772 10.5625 6C10.5625 6.55228 10.1148 7 9.5625 7H5Z" fill="\${svgFill}"/>
</svg>
            </a>
        </div>
      \`;
    }

    function createCategoryList(name, index) {
      const separator = String.fromCharCode(65 + index);
      return \`<div class="my-2 py-2" data-index="\${index}">
      <p class="text-gray-700 text-md"><span class="font-bold text-base">\${separator}.</span> \${name}</p>
      </div>\`;
    }
  </script>
  `
}

const skillCompetenciesScript = (
  skillsDefine: any,
  competenciesDefine: any,
  USE_MOCK_DATA: any
) => {
  const mockData = {
    skills: [
      {
        name: "Digital Dexterity",
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

  const result = USE_MOCK_DATA
    ? `generateSkillsCompetenciesSummary(${JSON.stringify(mockData)});`
    : `generateSkillsCompetenciesSummary({
    skills: <%- JSON.stringify(${skillsDefine}) %>,
    competencies:<%- JSON.stringify(${competenciesDefine}) %>
    });`;

  return `
<script>
  document.addEventListener("DOMContentLoaded", function () {
    function generateContent(items, type) {
      return items
        .map(
          ({ name, courses }, index) =>
            \`\${createCategoryList(name, index)}\${courses
              .map(({ name: courseName, url }) => {
              return \`<div class="ml-4">\${createSummaryTabs(courseName, type, url)}</div>\`;
              })
              .join("")}\`
        )
        .join("");
    }

    function generateSkillsCompetenciesSummary(data) {
      const { skills, competencies } = data;

      const skillsContent = generateContent(skills, "skills");
      const competenciesContent = generateContent(competencies, "competencies");

      const targetElement = document.getElementById("skills-competencies");
      if (targetElement) {
        targetElement.innerHTML = \`
          <div class="flex mb-4">
              <div class="flex-1 my-2">
                  <p class="text-md" style="color: #1D4ED8">Skills</p>
                  \${skillsContent}
              </div>
              <div class="flex-1 my-2">
                  <p class="text-md" style="color: #B91C1C">Competencies</p>
                  \${competenciesContent}
              </div>
          </div>
        \`;
      } else {
        console.error('Element with ID "skills-competencies" not found.');
      }
    }

    ${result}
  });
</script>
`;
};

function reportScript(
  skillsChartDefine: string,
  competenciesChartDefine: string,
  USE_MOCK_DATA: boolean
) {
  const mockSkillsData = {
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
  };
  const mockCompetenciesData = mockSkillsData;

  const chartDataStringSkills = USE_MOCK_DATA
    ? JSON.stringify(mockSkillsData)
    : `<%- JSON.stringify(${skillsChartDefine}) %>`;

  const chartDataStringCompetencies = USE_MOCK_DATA
    ? JSON.stringify(mockCompetenciesData)
    : `<%- JSON.stringify(${competenciesChartDefine}) %>`;

  return `
  <script>
    const skills = ${chartDataStringSkills};
    const competencies = ${chartDataStringCompetencies};

    const datasets = [];

    const chartDataArray = [skills, competencies];
    const chartLabels = ['Skills', 'Competencies'];

    // Label Dots Plugin
const labelDotsPlugin = {
    id: 'labelDots',
    afterDraw: (chart) => {
        const { ctx } = chart;

        // Loop through each dataset
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);

            // Check if meta.data is defined and has data points
            if (meta.data && meta.data.length) {
                // Loop through each data point
                meta.data.forEach((dataPoint, index) => {
                  const { x, y } = dataPoint.getProps(['x', 'y'], true); // Get x and y positions
                  const value = Number(dataset.data[index]); // Convert the value to a number

                  // Determine the dot size based on the value
                  const dotSize = value >= 3 ? 12 : 3;

                  // Draw a dot on each label with the background color of the dataset
                  ctx.beginPath();
                  ctx.arc(x, y, dotSize, 0, 2 * Math.PI); // Adjusted dot size
                  ctx.fillStyle = dataset.borderColor || 'black'; // Dot color from dataset
                  ctx.fill();

                  // Display the value in the middle of the dot only if it's 3 or higher
                  if (value >= 3) {
                      ctx.font = '12px Arial'; // Font style for the value
                      ctx.fillStyle = 'white'; // Color for the value text
                      ctx.textAlign = 'center'; // Center align the text
                      ctx.textBaseline = 'middle'; // Align text vertically in the middle of the dot
                      ctx.fillText(value, x, y); // Draw the value in the center of the dot
                  }
                });
            }
        });
    }
};


    chartDataArray.forEach((data, index) => {
        const { dataset, labels } = data;
        const chartType = chartLabels[index];

        let chartDatasets = [];

        // Configure datasets based on chartType
        if (chartType === 'Skills') {
            chartDatasets = [
                {
                    label: "2023 Banding",
                    data: dataset[0],
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    borderColor: "rgba(17, 59, 151, 1)",
                    borderWidth: 2,
                },
                {
                    label: "Current Banding",
                    data: dataset[1],
                    backgroundColor: "rgba(17, 59, 151, 0.2)",
                    borderColor: "rgba(17, 59, 151, 1)",
                    borderWidth: 2,
                },
                {
                    label: "Target Banding",
                    data: dataset[2],
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 4,
                },
            ];
        } else {
            chartDatasets = [
                {
                    label: "2023 Banding",
                    data: dataset[0],
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    borderColor: "rgb(179, 52, 3)",
                    borderWidth: 2,
                },
                {
                    label: "Current Banding",
                    data: dataset[1],
                    backgroundColor: "rgba(240, 180, 158, 0.5)",
                    borderColor: "rgb(179, 52, 3)",
                    borderWidth: 2,
                },
                {
                    label: "Target Banding",
                    data: dataset[2],
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 4,
                },
            ];
        }

        datasets.push(chartDatasets);

        function wrapLabel(label, maxLength) {
            if (label.length <= maxLength) return label;
            const words = label.split(' ');
            let wrappedLabel = '';
            let currentLine = '';
            words.forEach((word) => {
                if ((currentLine + word).length > maxLength) {
                    wrappedLabel += currentLine.trim() + '\\n';
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });
            if (currentLine.trim()) {
                wrappedLabel += currentLine.trim();
            }
            return wrappedLabel;
        }

        const axisLabels = labels.map((label) => wrapLabel(label, 20));

        // Custom plugin for alternating background in the radar chart
        const alternatingBackgroundPlugin = {
            id: 'alternatingBackground',
            beforeDraw: (chart) => {
                const { ctx, scales } = chart;
                if (!scales.r) return;
                const r = scales.r;
                const numSteps = r.ticks.length - 1;
                const numberOfSides = labels.length;
                for (let i = 0; i < numSteps; i++) {
                    ctx.beginPath();
                    const radius = r.getDistanceFromCenterForValue(i + 1);
                    for (let j = 0; j < numberOfSides; j++) {
                        const angle = (j * Math.PI * 2) / numberOfSides - Math.PI / 2;
                        const x = r.xCenter + radius * Math.cos(angle);
                        const y = r.yCenter + radius * Math.sin(angle);
                        ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fillStyle = i % 2 === 0 ? 'rgba(169, 169, 169, 0.3)' : 'rgba(128, 128, 128, 0.3)';
                    ctx.fill();
                }
            }
        };

        Chart.register(alternatingBackgroundPlugin, labelDotsPlugin);

        // Create the radar chart for both charts
        const chartId = 'radar-chart-' + chartType.toLowerCase();
        const ctx = document.getElementById(chartId)?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: axisLabels,
                    datasets: datasets[index]
                },
                options: {
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            min: 0,
                            max: 6,
                            grid: {
                              color: 'transparent',
                            },
                            ticks: {
                                display: false,
                                stepSize: 1,
                                color: 'black',
                                backdropColor: 'transparent'
                            },
                            grid: {
                                color: 'white',
                                lineWidth: 1,
                                borderDash: [5, 5]
                            },
                            angleLines: {
                                color: 'white',
                                borderDash: [5, 5]
                            },
                            pointLabels: {
                                display: true,
                                callback: (value) => value.split('\\n')
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                }
            });
        }
    });
</script>

  `;
}

const detailedSkillCompetenciesScript = (
  skillsChartDefine: string,
  competenciesChartDefine: string,
  USE_MOCK_DATA: boolean
) => {
  return `
  <script>
  function detailedSkillCompetenciesScript(dataType) {
    const data = {
      skills: [
        {
          name: "Digital Dexterity",
          score: { prev: 3, target: 4, current: 4 },
          requirements:
            "Understanding and utilizing modern digital tools and technologies.",
          courses: [
            { name: "Introduction to Digital Tools", url: "https://www.example.com/course1" },
            { name: "Advanced Digital Skills for Professionals", url: "https://www.example.com/course2" },
          ],
        },
        {
          name: "Legal Project Management",
          score: { prev: 4, target: 6, current: 5 },
          requirements:
            "Effective management of legal projects, teams, and resources.",
          courses: [
            { name: "Legal Project Management Fundamentals", url: "https://www.example.com/course3" },
            { name: "Managing Legal Risks", url: "https://www.example.com/course4" },
          ],
        },
        {
          name: "Business Development",
          score: { prev: 2, target: 4, current: 3 },
          requirements:
            "Understanding of market trends and ability to develop strategies to grow business.",
          courses: [
            { name: "Market Analysis and Business Strategies", url: "https://www.example.com/course5" },
            { name: "Advanced Business Development Techniques", url: "https://www.example.com/course6" },
          ],
        },
      ],
      competencies: [
        {
          name: "Collaboration & Teamwork",
          score: { prev: 5, target: 6, current: 5 },
          requirements:
            "Ability to work effectively with others to achieve common goals.",
          courses: [
            { name: "Team Collaboration in the Workplace", url: "https://www.example.com/course7" },
            { name: "Effective Communication in Teams", url: "https://www.example.com/course8" },
          ],
        },
        {
          name: "Leadership",
          score: { prev: 4, target: 7, current: 6 },
          requirements:
            "Inspiring and leading teams towards success, with focus on decision-making and management.",
          courses: [
            { name: "Leadership Essentials", url: "https://www.example.com/course9" },
            { name: "Strategic Leadership Skills", url: "https://www.example.com/course10" },
          ],
        },
        {
          name: "Networking",
          score: { prev: 3, target: 5, current: 4 },
          requirements:
            "Building and maintaining professional relationships that benefit career growth.",
          courses: [
            { name: "Networking Strategies for Career Growth", url: "https://www.example.com/course11" },
            { name: "Mastering Professional Networking", url: "https://www.example.com/course12" },
          ],
        },
      ],
    };

    const createElementInfo = (skill, category, index) => {
      const { name, requirements, courses, score } = skill;
      const { textClass, svgFill } = getCategoryStyles(category);

      if (score.current >= score.target) {
        return \`
          <div class="m-4 p-4 bg-white rounded-lg" style="background-color:#e6e6e6">
            <p class="text-xs font-bold flex items-center" style="color: #4BC0C0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4BC0C0" class="bi bi-check-circle mr-2" viewBox="0 0 16 16">
                <path d="M8 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm3.854-9.854a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7 8.793l3.146-3.147a.5.5 0 0 1 .708 0z"/>
              </svg>
              Target Banding Achieved
            </p>
          </div>
        \`;
      }

      return \`
        <div class="m-4 p-4 bg-white rounded-lg">
          <p class="text-xs font-bold" style="color: #4BC0C0">\${name}</p>

          <div class="flex mt-2">
            <div class="w-3/5 pr-4">
              <p class="font-semibold text-sm">Requirements</p>
              <p class="text-gray-500 text-sm">\${requirements}</p>
            </div>
            <div class="w-2/5 pl-4">
              <p class="font-semibold text-sm">Recommended Courses</p>
              <ul>
                \${courses
                  .map(
                    (course) => \`<li><a href="\${course.url}" class="text-xs \${textClass}">
                     <div class="ml-4">\${createSummaryTabs(course.name, category, course.url)}</div>
                    </a></li>\`
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
      \`;
    };

    const dataToUse = data[dataType];
    const category = dataType

    const elements = dataToUse
      .map((item, index) => {
        const { name, score } = item;
        return \`
          <div class="mt-2 mb-8">
            <p class="text-gray-700 text-md"><span class="font-bold text-base">\${index + 1}.</span> \${name}</p>
            <ul class="flex items-center space-x-2 mx-4 my-2">
              <li style="color: grey">2023 Banding: <strong>\${score.prev}</strong></li>
              <li><span class="w-1 h-1 bg-gray-400 rounded-full inline-block opacity-50"></span></li>
              <li style="color: #36A2EB">Current Banding: <strong>\${score.current}</strong></li>
              <li><span class="w-1 h-1 bg-gray-400 rounded-full inline-block opacity-50"></span></li>
              <li style="color: #4BC0C0">Target Banding: <strong>\${score.target}</strong></li>
            </ul>
            \${createElementInfo(item, category, index)}
          </div>
        \`;
      })
      .join("");

    const targetElementId = \`details-\${dataType}\`;
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = \`<div id='\${targetElementId}'>\${elements}</div>\`;
    }
  }

  detailedSkillCompetenciesScript('skills');
  detailedSkillCompetenciesScript('competencies');
  </script>
  `;
};

export {
  componentsScript,
  skillCompetenciesScript,
  reportScript,
  detailedSkillCompetenciesScript,
};
