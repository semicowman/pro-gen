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
    ? `generateSkillsCompetencies(${JSON.stringify(mockData)});`
    : `generateSkillsCompetencies({
    skills: <%- JSON.stringify(${skillsDefine}) %>,
    competencies:<%- JSON.stringify(${competenciesDefine}) %>
    });`;

  return `
<script>
  document.addEventListener("DOMContentLoaded", function () {
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
        <div class="flex items-center justify-between min-w-[200px] max-w-[288px] \${borderClass} \${bgClass} rounded-lg m-4 p-2" style="border-width: 1px;">
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
      return \`<div class="text-xs" data-index="\${index}">
      <h4 class="text-gray-700"><span class="font-bold text-base">\${separator}.</span> \${name}</h4>
      </div>\`;
    }

    function generateContent(items, type) {
      return items
        .map(
          ({ name, courses }, index) =>
            \`\${createCategoryList(name, index)}\${courses
              .map(({ name: courseName, url }) =>
                createSummaryTabs(courseName, type, url)
              )
              .join("")}\`
        )
        .join("");
    }

    function generateSkillsCompetencies(data) {
      const { skills, competencies } = data;

      const skillsContent = generateContent(skills, "skills");
      const competenciesContent = generateContent(competencies, "competencies");

      const targetElement = document.getElementById("skills-competencies");
      if (targetElement) {
        targetElement.innerHTML = \`
          <div class="flex mb-4">
              <div class="flex-1">
                  <h3 class="text-lg font-semibold">Skills</h3>
                  \${skillsContent}
              </div>
              <div class="flex-1">
                  <h3 class="text-lg font-semibold">Competencies</h3>
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

function skillReportScript(chartDefine: any, USE_MOCK_DATA: boolean) {
  const mockData = {
      dataset: [
        [1, 2, 3, 1, 2, 2, 3],
        [3, 4, 5, 4, 5, 5, 4],
        [4, 5, 5, 5, 5, 5, 4],
      ],
      labels:  [
        "Digital Dexterity",
        "Legal Project Management",
        "Commercial Risk Assessment for Clients",
        "Business Development",
        "Business Partnering",
        "Process Improvement",
        "Design Thinking & Legal Design",
      ]
  }
  const chartData = USE_MOCK_DATA
  ? JSON.stringify(mockData)
  : `<%- JSON.stringify(${chartDefine}) %>`;

return `
  <script>
      const chartData = ${chartData};
      const { dataset, labels } = chartData; 

    const datasets = [
      {
        label: "2023 Banding",
        data: (dataset[0]),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Current Banding",
        data: (dataset[1]),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Target Banding",
        data: (dataset[2]),
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 4,
      },
    ];

    function wrapLabel(label, maxLength) {
        if (label.length <= maxLength) {
            return label;
        }
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
    const axisLabels = (labels).map((label) => wrapLabel(label, 20));

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

    Chart.register(alternatingBackgroundPlugin);

    const ctx = document.getElementById('radar-chart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: axisLabels,
                datasets: datasets
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
  </script>
`;
}

const detailedSkillCompetenciesScript = (USE_MOCK_DATA: boolean) => { `
  <script>
    function generateDetailedSkillsCompetencies(data) {
      const { skills, competencies } = data;
      createCategoryList(skills, "skills");
      createCategoryList(competencies, "competencies");
    }
  </script>
`;
}

export { skillCompetenciesScript, skillReportScript, detailedSkillCompetenciesScript };
