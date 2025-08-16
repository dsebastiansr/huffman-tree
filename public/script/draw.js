window.drawHuffmanTree = function (tree) {
    const container = document.querySelector('.graph');
    if (!container) return;
    container.innerHTML = '';
    if (!tree) return;

    function toD3(node) {
        if (!node) return null;
        const children = [];
        if (node.left) children.push(toD3(node.left));
        if (node.right) children.push(toD3(node.right));
        return {
            name: node.character ? `${node.character}` : `${node.frequency}`,
            children: children.length ? children : undefined
        };
    }

    const data = toD3(tree);
    let width = container.offsetWidth;
    let height;
    if (window.innerWidth < 600) {
        height = Math.max(window.innerHeight * 0.5, 240);
    } else {
        height = container.offsetHeight || Math.min(window.innerHeight * 0.7, 600);
    }
    
    const margin = { top: 60, right: 1, bottom: 60, left: 1 };

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

    treeLayout(root);

    const nodeRadius = window.innerWidth < 600 ? 16 : 32;
    const nodeFontSize = window.innerWidth < 600 ? 12 : 18;
    const strokeFontSize = window.innerWidth < 600 ? 12 : 16;

    const links = root.links();

    svg.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.source.x)
        .attr('y2', d => d.source.y)
        .attr('stroke', '#1c1c1c')
        .attr('stroke-width', 3)
        .transition()
        .duration(500)
        .delay((d, i) => 200 + i * 60)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    svg.selectAll('link-label')
        .data(links)
        .enter()
        .append('text')
        .attr('x', d => {
            const base = (d.source.x + d.target.x) / 2;
            if (d.target.x < d.source.x) return base - 16; // Izquierda
            else return base + 16; // Derecha
        })
        .attr('y', d => (d.source.y + d.target.y) / 2.1)
        .attr('text-anchor', 'middle')
        .attr('font-size', strokeFontSize)
        .attr('fill', 'transparent')
        .transition()
        .duration(500)
        .delay((d, i) => 200 + i * 100)
        .attr('fill', '#fff')
        .text(d => {
            if (d.target.x < d.source.x) return '1';
            else return '0';
        });

    const node = svg.selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
        .attr('r', 0) // Empiezan con radio 0
        .attr('opacity', 0)
        .attr('fill', d => d.children ? '#252525' : '#3b3c42')
        .attr('stroke', '#222')
        .attr('stroke-width', 3)

        .transition()
        .duration(350)
        .delay((d, i) => i * 60) // Retraso escalonado
        
        .attr('r', nodeRadius) // Empiezan con radio 0
        .attr('opacity', 1)
        

    node.append('text')
        .attr('fill', 'transparent') // Inicia transparente
        .text(d => d.data.name)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', nodeFontSize)
        .attr('font-weight', '400')

        .transition()
        .duration(350)

        .delay((d, i) => 400 + i * 60) // Espera que el círculo aparezca
        .attr('fill', '#fff');

};