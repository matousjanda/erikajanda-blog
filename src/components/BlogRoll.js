import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import styled from "styled-components";

const ArticleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -1rem;
  margin-right: -1rem;

  & > * {
    width: 50%;
    padding: 1rem;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  line-height: 1.2;
  font-weight: 500;
`;

const Article = styled.article`
  background: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid #eee;
`;

const A = styled(Link)`
  color: cadetblue;

  &:hover {
    color: navy;
  }
`;

const Time = styled.time`
  color: #ccc;
`;

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <ArticleList>
        {posts &&
          posts.map(({ node: post }) => (
            <div>
              <Article>
                <header>
                  <Heading>
                    <A to={post.fields.slug}>{post.frontmatter.title}</A>
                  </Heading>
                  <time datetime={post.frontmatter.timestamp}>
                    {post.frontmatter.date}
                  </time>
                </header>
                <p>{post.excerpt}</p>
                <button>
                  <A to={post.fields.slug}>Keep Reading →</A>
                </button>
              </Article>
            </div>
          ))}
      </ArticleList>
    );
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                timestamp: date
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
);
