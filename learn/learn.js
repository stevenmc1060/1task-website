(() => {
    const postsElement = document.querySelector('#learn-posts');
    const statusElement = document.querySelector('#learn-status');
    const contentElement = document.querySelector('#learn-content');
    const config = window.SANITY_CONFIG || {};

    const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    })[character]);

    const formatDate = (value) => value
        ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value))
        : '';

    const imageUrl = (image) => {
        const ref = image?.asset?._ref;
        if (!ref) return '';
        const [, id, dimensions, format] = ref.match(/^image-([a-f\d]+)-(\d+x\d+)-([a-z]+)$/i) || [];
        return id ? `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${id}-${dimensions}.${format}?auto=format&w=1200` : '';
    };

    const textFromBlock = (block) => (block.children || []).map((child) => child.text || '').join('');

    const renderBlocks = (blocks = []) => blocks.map((block) => {
        if (block._type === 'image') {
            const src = imageUrl(block);
            return src ? `<figure><img src="${src}" alt="${escapeHtml(block.alt || '')}" loading="lazy"></figure>` : '';
        }
        if (block._type !== 'block') return '';
        const text = escapeHtml(textFromBlock(block));
        if (!text) return '';
        if (block.style === 'h2' || block.style === 'h3') return `<${block.style}>${text}</${block.style}>`;
        if (block.style === 'blockquote') return `<blockquote>${text}</blockquote>`;
        return `<p>${text}</p>`;
    }).join('');

    const querySanity = async (query, params = {}) => {
        const endpoint = new URL(`https://${config.projectId}.apicdn.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`);
        endpoint.searchParams.set('query', query);
        endpoint.searchParams.set('perspective', 'published');
        Object.entries(params).forEach(([key, value]) => endpoint.searchParams.set(`$${key}`, JSON.stringify(value)));
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Sanity request failed (${response.status})`);
        return (await response.json()).result;
    };

    const renderPost = async (slug) => {
        const post = await querySanity(`*[_type == "post" && slug.current == $slug][0]{title, excerpt, publishedAt, mainImage, body, "author": author->name}`, { slug });
        if (!post) {
            statusElement.textContent = 'Article not found.';
            return;
        }
        document.title = `${post.title} | 1task`;
        contentElement.innerHTML = `<article class="learn-article container">
            <a class="learn-back" href="/learn/">← All articles</a>
            <header><p class="eyebrow">${escapeHtml(post.author || '1task')}</p><h1>${escapeHtml(post.title)}</h1><p class="learn-article-meta">${formatDate(post.publishedAt)}</p>${post.excerpt ? `<p class="learn-article-deck">${escapeHtml(post.excerpt)}</p>` : ''}</header>
            ${imageUrl(post.mainImage) ? `<img class="learn-article-image" src="${imageUrl(post.mainImage)}" alt="${escapeHtml(post.mainImage.alt || '')}">` : ''}
            <div class="learn-article-body">${renderBlocks(post.body)}</div>
        </article>`;
    };

    const renderIndex = async () => {
        const posts = await querySanity(`*[_type == "post"] | order(publishedAt desc){title, excerpt, publishedAt, mainImage, "slug": slug.current, "author": author->name}`);
        statusElement.textContent = posts.length ? `${posts.length} article${posts.length === 1 ? '' : 's'}` : 'No articles published yet.';
        postsElement.innerHTML = posts.map((post) => `<article class="learn-card">
            <a href="/learn/?slug=${encodeURIComponent(post.slug)}">
                ${imageUrl(post.mainImage) ? `<img src="${imageUrl(post.mainImage)}" alt="${escapeHtml(post.mainImage.alt || '')}" loading="lazy">` : '<div class="learn-card-placeholder" aria-hidden="true"></div>'}
                <div class="learn-card-copy"><p class="learn-card-meta">${formatDate(post.publishedAt)}${post.author ? ` · ${escapeHtml(post.author)}` : ''}</p><h3>${escapeHtml(post.title)}</h3>${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}<span>Read article <span aria-hidden="true">→</span></span></div>
            </a>
        </article>`).join('');
    };

    const showSetup = () => {
        statusElement.textContent = 'Sanity connection ready to configure.';
        postsElement.innerHTML = `<div class="learn-setup"><p class="eyebrow">One setup step remains</p><h3>Connect your Sanity project</h3><p>Replace <code>YOUR_PROJECT_ID</code> in <code>sanity.config.js</code>, then publish your first post in the included Studio.</p></div>`;
    };

    if (!/^[a-z0-9-]+$/i.test(config.projectId || '') || config.projectId === 'YOUR_PROJECT_ID') {
        showSetup();
        return;
    }

    const slug = new URLSearchParams(window.location.search).get('slug');
    (slug ? renderPost(slug) : renderIndex()).catch((error) => {
        console.error(error);
        statusElement.textContent = 'Articles could not be loaded. Check the Sanity project settings and CORS origin.';
    });
})();
