import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const handleImportExcel = (e) => {
    // 获取上传的文件对象
    const file = e?.target?.files?.[0];
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: "binary" });
        let data = []; // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
            // break; // 如果只取第一张表，就取消注释这行
          }
        }
        translateJsonData(data);
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        console.log("文件类型不正确");
        return;
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file);
  };

  const translateJsonData = (jsonData) => {
    const translateData = [];
    for (let [index, item] of jsonData.entries()) {
      const content = [];
      for (let [key, value] of Object.entries(item)) {
        content.push({ text_title: key, text_content: value });
      }
      translateData.push({ id: index, content: JSON.stringify(content) });
    }
    console.log(translateData);
    exportExcel(translateData);
  };

  const exportExcel = (srcData) => {
    // 创建workbook对象
    const wb = XLSX.utils.book_new();
    // 将srcData转换为worksheet
    const ws = XLSX.utils.json_to_sheet(srcData);
    // worksheet 加入workbook
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    // 导出
    XLSX.writeFile(wb, "translate.xlsx");
  };

  return (
    <div className="App">
      <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} />
    </div>
  );
}

export default App;
