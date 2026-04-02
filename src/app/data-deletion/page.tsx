export default function DataDeletionPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold font-headline mb-8">Data Deletion Request</h1>
      
      <div className="prose prose-neutral min-w-full">
        <p className="mb-4 text-lg">
          To request the complete deletion of your data from Jeany's Ol Shoppe, 
          please send an email to our support team at:
        </p>
        
        <p className="font-bold text-xl text-primary my-6">support@jeanys-olshoppe.com</p>
        
        <p className="mt-4 text-muted-foreground">
          Please send the email from the address associated with your Facebook profile. 
          We will process your request within 30 days and permanently delete all personal data, 
          including your profile photo, name, and wishlist, associated with your account.
        </p>
      </div>
    </div>
  )
}
