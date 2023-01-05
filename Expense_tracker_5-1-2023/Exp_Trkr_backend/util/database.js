const Sequelize=require('sequelize');
const sequelize=new Sequelize(
    'finalexpense',
    'root',
    'tharakiran',
    {
        dialect:'mysql',
        host:'localhost'
    }
);

module.exports=sequelize;