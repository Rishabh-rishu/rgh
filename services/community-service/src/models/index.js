const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const id = {
  type: DataTypes.STRING,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
};

const Post = sequelize.define('Post', {
  id,
  authorId: { type: DataTypes.STRING, allowNull: false, field: 'author_id' },
  title: DataTypes.STRING,
  content: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'published' },
}, {
  tableName: 'posts',
  underscored: true,
});

const Comment = sequelize.define('Comment', {
  id,
  postId: { type: DataTypes.STRING, allowNull: false, field: 'post_id' },
  authorId: { type: DataTypes.STRING, allowNull: false, field: 'author_id' },
  content: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'comments',
  underscored: true,
});

const Like = sequelize.define('Like', {
  id,
  postId: { type: DataTypes.STRING, allowNull: false, field: 'post_id' },
  userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
}, {
  tableName: 'likes',
  underscored: true,
  updatedAt: false,
  indexes: [{ unique: true, fields: ['post_id', 'user_id'] }],
});

const Report = sequelize.define('Report', {
  id,
  postId: { type: DataTypes.STRING, field: 'post_id' },
  reporterId: { type: DataTypes.STRING, allowNull: false, field: 'reporter_id' },
  reason: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
}, {
  tableName: 'reports',
  underscored: true,
  updatedAt: false,
});

Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' });
Post.hasMany(Like, { as: 'likes', foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { as: 'post', foreignKey: 'postId' });
Post.hasMany(Report, { as: 'reports', foreignKey: 'postId', onDelete: 'SET NULL' });
Report.belongsTo(Post, { as: 'post', foreignKey: 'postId' });

module.exports = {
  sequelize,
  Post,
  Comment,
  Like,
  Report,
};
