namespace Notes.API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Notes", "NoteContainer_ID", "dbo.NoteContainers");
            DropIndex("dbo.Notes", new[] { "NoteContainer_ID" });
            RenameColumn(table: "dbo.Notes", name: "NoteContainer_ID", newName: "NoteContainerID");
            AlterColumn("dbo.Notes", "NoteContainerID", c => c.Int(nullable: false));
            CreateIndex("dbo.Notes", "NoteContainerID");
            AddForeignKey("dbo.Notes", "NoteContainerID", "dbo.NoteContainers", "ID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Notes", "NoteContainerID", "dbo.NoteContainers");
            DropIndex("dbo.Notes", new[] { "NoteContainerID" });
            AlterColumn("dbo.Notes", "NoteContainerID", c => c.Int());
            RenameColumn(table: "dbo.Notes", name: "NoteContainerID", newName: "NoteContainer_ID");
            CreateIndex("dbo.Notes", "NoteContainer_ID");
            AddForeignKey("dbo.Notes", "NoteContainer_ID", "dbo.NoteContainers", "ID");
        }
    }
}
