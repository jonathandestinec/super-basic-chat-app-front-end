import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ME {
  user: {
    _id: string;
    name: string;
  };
  token: string;
}

export default function UserInfo({ me }: { me: ME }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src="https://imgs.search.brave.com/NCHRYwdILiBdJhgcrbAO86_H-G-N3P_g2trTEo-26gU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/ZmF2b3VyaXRlLXBp/Y3R1cmUtcy1vZi1u/ZXl0aXJpLXYwLWU0/ZmNtbTZ3OTdwZDEu/anBlZz93aWR0aD03/NTAmZm9ybWF0PXBq/cGcmYXV0bz13ZWJw/JnM9NTA0MDZhNDQ2/ODZiNjVmZmU0NzY5/N2YzMTkwOTRiOTVj/ZjU4MzAzOQ"
            alt={me.user.name}
          />
          <AvatarFallback>{me.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{me.user.name}</p>
          <p className="text-sm text-gray-400">ID: {me.user._id}</p>
        </div>
      </CardContent>
    </Card>
  );
}
