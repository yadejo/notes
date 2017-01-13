namespace Notes.API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.NoteContainers",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.Notes",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        IsComplete = c.Boolean(nullable: false),
                        Content = c.String(),
                        NoteContainer_ID = c.Int(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.NoteContainers", t => t.NoteContainer_ID)
                .Index(t => t.NoteContainer_ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Notes", "NoteContainer_ID", "dbo.NoteContainers");
            DropIndex("dbo.Notes", new[] { "NoteContainer_ID" });
            DropTable("dbo.Notes");
            DropTable("dbo.NoteContainers");
        }
    }
}
