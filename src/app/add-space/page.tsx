import AddSpaceForm from '@/components/AddSpaceForm';

export default function AddSpacePage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Register Your Space
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share your home as a prayer space for the community.
        </p>
      </div>
      <AddSpaceForm />
    </div>
  );
}
