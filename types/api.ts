export type Blog = {
    title: string;
    created_at: string;
    updated_at: string;
};

export type MiniBlog = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    content?: string;
};

export type Post = {
    postId: number;
    blogTitle: string;
    title: string;
    created_at: string;
    updated_at: string;
    content?: string;
};

type ProjectBase = {
    name: string;
    description: string | null;
};

type ProjectWithRepo = ProjectBase & {
    url: string;
    repo: GitHubRepo;
};

type ProjectWithoutRepo = ProjectBase & {
    url: string | null;
    repo: null;
};

export type Project = ProjectWithRepo | ProjectWithoutRepo;

export type Update = {
    text: string;
    date: string;
};

type PublicGitHubRepo = {
    visibility: "public";
    most_recent_commit: string;
    link: string;
    stars: number;
};

type PrivateGithubRepo = {
    visibility: "private";
};

export type GitHubRepo = {
    id: number;
    name: string;
    description: string | null;
    languages: Map<string, string>;
    created_at: string;
    updated_at: string;
} & (PublicGitHubRepo | PrivateGithubRepo);

// Raw shape of GitHub API repo response
export type GithubRawRepo = {
    id: number;
    name: string;
    private: boolean;
    html_url: string;
    stargazers_count: number;
    created_at: string;
    pushed_at: string;
    owner: { login: string };
};

export type Subscriber = {
    id: number;
    email: string;
    confirmed: boolean;
    unsubscribeToken: string;
    created_at: string;
};

export type Subscription = {
    id: number;
    subscriberId: number;
    blogTitle: string | null;
    created_at: string;
};

export type SubscribeDto = {
    email: string;
    blogTitle?: string;
};

// DTOs
export type CreateBlogDto = { title: string };
export type CreatePostDto = { title: string; content?: string };
export type CreateMiniBlogDto = { title: string; content?: string };
export type CreateCommentDto = { name: string; message: string };

export type Comment = {
    id: number;
    name: string;
    message: string;
    verified: boolean;
    created_at: string;
};

export type PaginatedComments = {
    comments: Comment[];
    total: number;
    page: number;
    pageSize: number;
};
