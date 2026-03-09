import "./App.scss";
import menuData from "./menuData";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { Select, Switch, Button, Space, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const isMobile = window.innerWidth <= 768;

// 定义菜品项的类型
interface MenuItem {
  name: string;
  price: number | string;
  isHot?: boolean;
}

// 定义排序类型
type SortType = "none" | "isHot" | "price";

function App() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortType, setSortType] = useState<SortType>("none");
  const [showHotIcon, setShowHotIcon] = useState(true);

  useEffect(() => {
    const scaleRatio = (window.outerWidth - 40) / 800;
    document
      .getElementById("root")
      ?.style.setProperty("--scale-ratio", scaleRatio.toString());
  }, []);

  const renderPrice = (price: number | string) => {
    if (typeof price === "number") {
      return `${price} 元`;
    }
    return <span className="small-text">{price}</span>;
  };

  const toggleItem = (itemName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  // 排序函数
  const sortItems = (items: MenuItem[]) => {
    if (sortType === "none") return items;

    return [...items].sort((a, b) => {
      if (sortType === "isHot") {
        // 辣菜优先，然后按名称排序
        const aIsHot = a.isHot || false;
        const bIsHot = b.isHot || false;
        if (aIsHot && !bIsHot) return -1;
        if (!aIsHot && bIsHot) return 1;
        return a.name.localeCompare(b.name);
      } else if (sortType === "price") {
        // 按价格排序（数字价格优先，然后按字符串排序）
        const aPrice = typeof a.price === "number" ? a.price : 0;
        const bPrice = typeof b.price === "number" ? b.price : 0;
        if (aPrice !== bPrice) return bPrice - aPrice;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  const captureMenu = async () => {
    setIsCapturing(true);
    try {
      const element = document.getElementById("menu-container");
      if (element) {
        const canvas = await html2canvas(element, {
          scale: isMobile ? 8 : 2, // 提高图片质量
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
        });

        // 创建下载链接
        const link = document.createElement("a");
        link.download = `${menuData.title}-菜单.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("截图失败:", error);
      alert("截图失败，请重试");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="app">
      <Card className="toolbar" style={{ marginBottom: 16 }}>
        <Space
          size="large"
          align="center"
          direction={isMobile ? "vertical" : "horizontal"}
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space size="large" direction={isMobile ? "vertical" : "horizontal"}>
            <Space>
              <span>排序方式：</span>
              <Select
                value={sortType}
                onChange={(value) => setSortType(value as SortType)}
                style={{ width: 120 }}
                options={[
                  { value: "none", label: "默认排序" },
                  { value: "isHot", label: "辣菜优先" },
                  { value: "price", label: "价格排序" },
                ]}
              />
            </Space>
            <Space>
              <span>显示辣菜标志：</span>
              <Switch checked={showHotIcon} onChange={setShowHotIcon} />
            </Space>
          </Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={captureMenu}
            loading={isCapturing}
          >
            {isCapturing ? "生成中..." : "下载菜单图片"}
          </Button>
        </Space>
      </Card>

      <div id="menu-container" className="menu-container">
        <h1 className="menu-title">{menuData.title}</h1>

        <div className="menu-content">
          {menuData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="menu-section">
              <h2>{category.name}</h2>
              <div className="menu-items">
                {sortItems(category.items).map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="menu-item"
                    style={{
                      fontSize:
                        typeof item.price === "number" ? "16px" : "14px",
                    }}
                  >
                    <span className="item-name">
                      {item.name} {showHotIcon && item.isHot ? "🌶" : ""}
                    </span>
                    <span className="dots"></span>
                    <span className="price">{renderPrice(item.price)}</span>
                    <div
                      className={`custom-checkbox ${selectedItems.has(item.name) ? "checked" : ""}`}
                      onClick={() => toggleItem(item.name)}
                    >
                      {selectedItems.has(item.name) && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <p>订餐电话: {menuData.contact.phones.join(" / ")}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
