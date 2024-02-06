const fs = require("fs")
const path = require("path")
const express = require("express")

const app = express()
app.listen(3000, () => console.log("Server is running on port 3000"))
app.use(express.static(path.join(__dirname, "public")))


app.get("/api/getClass", async (req, res) => {
    
})
app.get("/api/getClasses", async (req, res) => {
    var json = {}

    const folder = path.join(__dirname, "/public/classes");
    const dir = await fs.readdirSync(folder);
    const map = dir.map(async levelName => {
        json[levelName] = [];
        const file_path = path.join(folder, levelName);
        const classNames = await fs.readdirSync(file_path)
        classNames.map(className => { json[levelName].push(className); });
    });
    await Promise.all(map);
    res.send(json);
})
app.get("/api/getCommonSubj", async (req, res) => {
    var output = {};

    const { subjectName } = req.query
    const classesPath = path.join(__dirname, "/public/classes")
    const levelDir = await fs.readdirSync(classesPath)
    const m = levelDir.map(async lvl => {
        const classNames = await fs.readdirSync(path.join(classesPath, lvl))
        classNames.map(async className => {
            const weekList = require(path.join(classesPath, lvl, className, "odd.json"))
            for (const day in weekList) {
                const dayList = weekList[day];
                for (const time in dayList) {
                    const name = dayList[time];

                    if (name !== subjectName) continue
                    if (!output[day]) output[day] = {}
                    if (!output[day][time]) output[day][time] = []

                    var timep2 = parseInt(time) + 20
                    timep2 = timep2 < 1000 ? ("0" + timep2) : timep2.toString()
                    if (!output[day][timep2]) output[day][timep2] = []

                    output[day][time].push(lvl + className)
                    output[day][timep2].push(lvl + className)
                }
            }
        })
    })
    await Promise.all(m);
    res.send(output);
})

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "public\\status-404\\index.html")))