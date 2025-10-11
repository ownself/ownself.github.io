---
layout: page
title: 拾言
subtitle: 灵感如风，随性而致
---

<!-- 顶部筛选控制 -->
<div class="fragments-top-filters">
  <div class="fragments-filters">
    <div class="fragments-filter">
      <label for="yearFilter">按年份筛选：</label>
      <select id="yearFilter" onchange="filterFragments()">
        <!-- 选项将通过JavaScript动态生成 -->
      </select>
    </div>

    <div class="fragments-filter">
      <label for="categoryFilter">按类别筛选：</label>
      <select id="categoryFilter" onchange="filterFragments()">
        <!-- 选项将通过JavaScript动态生成 -->
      </select>
    </div>
  </div>
</div>

<div class="fragments-container" id="fragmentsContainer">
  <!-- 拾言内容将通过JavaScript动态加载 -->
</div>

<!-- 底部分页控制 -->
<div class="fragments-bottom-controls">
  <div class="fragments-pagination-info">
    <span id="fragmentsInfo">显示第 <span id="currentStart">1</span>-<span id="currentEnd">50</span> 条，共 <span id="totalFragments">0</span> 条</span>
  </div>

  <div class="fragments-pagination" id="fragmentsPagination">
  </div>
</div>

<!-- 图片预览模态框 -->
<div id="imageModal" class="modal" onclick="closeModal()">
  <span class="close">&times;</span>
  <img class="modal-content" id="modalImage">
</div>

<style>
.fragments-container {
  max-width: 800px;
  margin: 0 auto;
}

.fragment-item {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-left: 3px solid var(--fragment-border, #008AFF);
  background: var(--fragment-bg, #f8f9fa);
  border-radius: 0 8px 8px 0;
}

.fragment-time {
  color: var(--fragment-time-color, #666);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
}

.fragment-category {
  color: var(--fragment-category-color, #008AFF);
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 1rem;
  padding: 0.2rem 0.6rem;
  background: var(--fragment-category-bg, rgba(0, 138, 255, 0.1));
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segui UI', sans-serif;
}

.fragment-content {
  line-height: 1.6;
  text-align: left !important;
}

.fragment-content p {
  margin-bottom: 0.5rem;
}

.fragment-content a {
  color: var(--link-color, #008AFF);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-bottom-color 0.2s ease;
}

.fragment-content a:hover {
  border-bottom-color: var(--link-color, #008AFF);
}

.fragment-images {
  margin-top: 1rem;
  display: flex !important;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-start !important;
}

/* 单张图片：保持原始横纵比 */
.fragment-images.single-image .fragment-img {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin: 0 !important;
}

/* 多张图片：1:1 正方形缩略图 */
.fragment-images.multiple-images .fragment-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin: 0 !important;
}

.fragment-img:hover {
  transform: scale(1.05);
}

/* 模态框样式 */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
}

.modal-content {
  margin: auto;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  width: auto;
  height: auto;
  object-fit: contain;
}

.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: #bbb;
}

/* 顶部筛选控制样式 */
.fragments-top-filters {
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: var(--fragment-bg, #f8f9fa);
  border-radius: 8px;
}

.fragments-filters {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
}

/* 底部分页控制样式 */
.fragments-bottom-controls {
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  background: var(--fragment-bg, #f8f9fa);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.fragments-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fragments-filter select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.fragments-pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.fragments-pagination {
  flex-grow: 1;
  text-align: center;
}

.fragments-pagination .pagination {
  justify-content: center;
  margin-bottom: 0;
}

.fragments-pagination .page-item.active .page-link {
  background-color: var(--link-color, #008AFF);
  border-color: var(--link-color, #008AFF);
}

@media (max-width: 768px) {
  .fragment-item {
    margin: 0 -1rem 2rem -1rem;
    border-radius: 0;
  }

  .fragment-images.single-image .fragment-img {
    max-width: 150px;
    max-height: 150px;
  }

  .fragment-images.multiple-images .fragment-img {
    width: 120px;
    height: 120px;
  }

  .fragment-category {
    font-size: 0.7rem;
    margin-left: 0.5rem;
    padding: 0.1rem 0.4rem;
  }

  .fragments-top-filters {
    padding: 1.5rem 1rem;
  }

  .fragments-bottom-controls {
    padding: 1.5rem 1rem;
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .fragments-filters {
    flex-direction: column;
    gap: 1rem;
  }

  .fragments-filter {
    justify-content: center;
  }

  .fragments-pagination {
    flex-grow: 0;
  }

  .fragments-pagination .pagination {
    flex-wrap: wrap;
    font-size: 0.8rem;
  }
}
</style>

<!-- 引入 marked.js 用于 Markdown 解析 -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<!-- 隐藏的数据容器 -->
<script type="application/json" id="fragmentsData">
{
  "fragments": [
    {% assign all_fragments = '' | split: ',' %}
    {% for fragment_file in site.fragments %}
      {% for fragment in fragment_file.fragments %}
        {% assign all_fragments = all_fragments | push: fragment %}
      {% endfor %}
    {% endfor %}
    {% assign sorted_fragments = all_fragments | sort: 'datetime' | reverse %}
    {% for fragment in sorted_fragments %}
      {% assign current_year = fragment.datetime | date: '%Y' %}
    {
      "datetime": "{{ fragment.datetime }}",
      "content": {{ fragment.content | jsonify }},
      "year": {{ current_year }},
      "category": "{{ fragment.category | default: '默认' }}",
      {% if fragment.image %}
      "image": "{{ fragment.image }}",
      {% endif %}
      {% if fragment.images %}
      "images": {{ fragment.images | jsonify }},
      {% endif %}
      "formatted_time": "{{ fragment.datetime | date: '%Y-%m-%d %H:%M' }}"
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>

<script>
// 全局变量
let allFragments = [];
let filteredFragments = [];
let currentYearFilter = '';
let currentCategoryFilter = 'all';
let currentPage = 1;
const itemsPerPage = 50;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 配置 marked.js
  if (typeof marked !== 'undefined') {
    // 自定义渲染器，为链接添加 target="_blank"
    const renderer = new marked.Renderer();
    const originalLinkRenderer = renderer.link;
    
    renderer.link = function(href, title, text) {
      const html = originalLinkRenderer.call(this, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
    };
    
    marked.setOptions({
      breaks: true,        // 支持GitHub风格的换行
      gfm: true,          // 启用GitHub风格的Markdown
      headerIds: false,   // 禁用标题ID生成
      mangle: false,      // 禁用邮箱地址混淆
      renderer: renderer  // 使用自定义渲染器
    });
  }
  
  loadFragments();
  setupYearFilter();
  setupCategoryFilter();
  filterFragments(); // 使用filterFragments来应用默认筛选
});

// 加载碎碎念数据
function loadFragments() {
  try {
    const dataScript = document.getElementById('fragmentsData');
    if (!dataScript) {
      console.error('无法找到fragmentsData元素');
      return;
    }

    const data = JSON.parse(dataScript.textContent.trim());
    allFragments = data.fragments || [];
    filteredFragments = [...allFragments];

    console.log('成功加载', allFragments.length, '条拾言');
  } catch (error) {
    console.error('加载拾言数据失败:', error);
    allFragments = [];
    filteredFragments = [];
  }
}

// 设置年份筛选器
function setupYearFilter() {
  const yearFilter = document.getElementById('yearFilter');
  if (!yearFilter || allFragments.length === 0) {
    console.warn('无法设置年份筛选器');
    return;
  }

  const years = [...new Set(allFragments.map(f => f.year))].sort((a, b) => b - a);

  // 清空现有选项（保留默认的"全部年份"选项）
  yearFilter.innerHTML = '';

  // 添加年份选项
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year + '年';
    yearFilter.appendChild(option);
  });

  // 添加"全部年份"选项到底部
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = '全部年份';
  yearFilter.appendChild(allOption);

  // 默认选择最新年份
  if (years.length > 0) {
    const latestYear = years[0];
    yearFilter.value = latestYear;
    currentYearFilter = latestYear.toString();
  }

  console.log('年份筛选器设置完成，共', years.length, '个年份，默认选择', years[0]);
}

// 设置类别筛选器
function setupCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter || allFragments.length === 0) {
    console.warn('无法设置类别筛选器');
    return;
  }

  const categories = [...new Set(allFragments.map(f => f.category))].sort();

  // 清空现有选项
  categoryFilter.innerHTML = '';

  // 添加"所有类别"选项在顶部
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = '所有类别';
  categoryFilter.appendChild(allOption);

  // 添加类别选项
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  console.log('类别筛选器设置完成，共', categories.length, '个类别');
}

// 组合筛选
function filterFragments() {
  const yearFilter = document.getElementById('yearFilter');
  const categoryFilter = document.getElementById('categoryFilter');

  currentYearFilter = yearFilter.value;
  currentCategoryFilter = categoryFilter.value;

  filteredFragments = allFragments.filter(fragment => {
    let matchYear = currentYearFilter === 'all' || fragment.year == currentYearFilter;
    let matchCategory = currentCategoryFilter === 'all' || fragment.category === currentCategoryFilter;
    return matchYear && matchCategory;
  });

  currentPage = 1;
  displayFragments();

  console.log('筛选结果：', filteredFragments.length, '条拾言');
}

// 显示碎碎念
function displayFragments() {
  const container = document.getElementById('fragmentsContainer');
  if (!container) {
    console.error('无法找到fragmentsContainer元素');
    return;
  }

  const totalItems = filteredFragments.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageFragments = filteredFragments.slice(startIndex, endIndex);

  console.log('显示拾言:', pageFragments.length, '条 (第', startIndex + 1, '-', endIndex, '条，共', totalItems, '条)');

  // 清空容器
  container.innerHTML = '';

  if (pageFragments.length === 0) {
    container.innerHTML = '<div class="alert alert-info">暂无拾言内容</div>';
    return;
  }

  // 渲染碎碎念
  pageFragments.forEach(fragment => {
    const fragmentDiv = document.createElement('div');
    fragmentDiv.className = 'fragment-item';

    let imagesHtml = '';
    if (fragment.image) {
      imagesHtml = `<div class="fragment-images single-image">
        <img src="${fragment.image}" alt="拾言图片" class="fragment-img" onclick="openModal('${fragment.image}')">
      </div>`;
    } else if (fragment.images) {
      const imageClass = fragment.images.length === 1 ? 'single-image' : 'multiple-images';
      const imageElements = fragment.images.map(img =>
        `<img src="${img}" alt="拾言图片" class="fragment-img" onclick="openModal('${img}')">`
      ).join('');
      imagesHtml = `<div class="fragment-images ${imageClass}">${imageElements}</div>`;
    }

    // 处理多行内容，使用 Markdown 解析
    let formattedContent = '';
    if (typeof marked !== 'undefined') {
      // 使用 marked.js 解析 Markdown
      const htmlContent = marked.parse(fragment.content);
      // 将解析后的内容按段落分割并包装
      formattedContent = htmlContent;
    } else {
      // 降级处理：如果 marked.js 未加载，使用原来的方法
      formattedContent = fragment.content
        .split('\n\n')  // 按双换行符分割段落
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
    }

    fragmentDiv.innerHTML = `
      <div class="fragment-time">${fragment.formatted_time} <span class="fragment-category">${fragment.category}</span></div>
      <div class="fragment-content">
        ${formattedContent}
        ${imagesHtml}
      </div>
    `;

    container.appendChild(fragmentDiv);
  });

  // 更新信息和分页
  updatePaginationInfo(startIndex + 1, endIndex, totalItems);
  renderPagination(totalItems);
}

// 更新分页信息
function updatePaginationInfo(start, end, total) {
  document.getElementById('currentStart').textContent = start;
  document.getElementById('currentEnd').textContent = end;
  document.getElementById('totalFragments').textContent = total;
}

// 渲染分页控件
function renderPagination(totalItems) {
  const pagination = document.getElementById('fragmentsPagination');
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let paginationHtml = '<ul class="pagination main-pager">';

  // 上一页
  if (currentPage > 1) {
    paginationHtml += `<li class="page-item previous">
      <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">&larr; 上一页</a>
    </li>`;
  }

  // 页码
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHtml += `<li class="page-item">
      <a class="page-link" href="#" onclick="goToPage(1)">1</a>
    </li>`;
    if (startPage > 2) {
      paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHtml += `<li class="page-item ${i === currentPage ? 'active' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
    </li>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    paginationHtml += `<li class="page-item">
      <a class="page-link" href="#" onclick="goToPage(${totalPages})">${totalPages}</a>
    </li>`;
  }

  // 下一页
  if (currentPage < totalPages) {
    paginationHtml += `<li class="page-item next">
      <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">下一页 &rarr;</a>
    </li>`;
  }

  paginationHtml += '</ul>';
  pagination.innerHTML = paginationHtml;
}

// 跳转到指定页面
function goToPage(page) {
  currentPage = page;
  displayFragments();

  // 滚动到页面顶部
  document.querySelector('.fragments-container').scrollIntoView({
    behavior: 'smooth'
  });
}

// 图片模态框功能
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = 'block';
  modalImg.src = imageSrc;
}

function closeModal() {
  document.getElementById('imageModal').style.display = 'none';
}

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});
</script>
